from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import Film, Genre


def do_login(request):
    if request.method == "GET":
        next_page = request.GET.get("next")
        if next_page is None:
            next_page = "dashboard"
        context = {"next": next_page}
        return render(request, "login.html", context)

    elif request.method == "POST":
        user_name = request.POST["username"]
        user_password = request.POST["password"]
        next_page = request.POST.get("next")

        if next_page is None:
            next_page = request.POST["next"]
        user = authenticate(username=user_name, password=user_password)

        if user is not None:
            login(request, user)
            request.session["is_staff"] = user.is_staff
            return redirect(next_page)

        else:
            context = {"next": next_page,
                       "error": "Authentication error, user or password are not valid",
                       "user_name": user_name}
            return render(request, "login.html", context)

    return HttpResponse("Nothing")


@login_required(login_url="login")
def do_logout(request):
    logout(request)
    return redirect("login")


@login_required(login_url="login")
def dashboard(request):
    context = {"Latest": Film.objects.order_by("-date")[:12],
               "Popular": Film.objects.order_by("-rating")[:12]}

    # Gets the categories in the data base and create list from each genre, order by the rating
    genres = Genre.objects.all().order_by("name")
    for genre in genres:
        film_list = Film.objects.filter(genres=genre).order_by("-rating")[:12]
        if len(film_list) > 8:
            context[genre.name.replace(" ", "_")] = film_list

    context = {"Genres": context,
               "All_films": Film.objects.all()}
    return render(request, "dashboard.html", context)


@login_required(login_url="login")
def get_film(request, film_name):
    film = Film.objects.get(name=film_name)
    context = {"film_name": film.name, "film_description": film.description, "film_date": film.date,
               "film_director": film.director, "film_actors": film.actors, "film_poster": film.poster,
               "film_rating": film.rating,
               "film_genres": ', '.join(film.genres.all().values_list("name", flat=True))}

    print(','.join(film.genres.all().values_list("name", flat=True)).replace(" ", "_"))

    return render(request, "film.html", context)


@login_required(login_url="login")
def get_video(request, film_name):
    film = Film.objects.get(name=film_name)
    context = {"film_url": film.url}
    return render(request, "video.html", context)


@login_required(login_url="login")
def post_film(request):
    if not request.session["is_staff"]:
        return redirect("dashboard")

    if request.method == "GET":
        return render(request, "post_film.html")

    elif request.method == "POST":
        film_name = request.POST["film_name"]
        film_url = request.POST["film_url"]
        film_description = request.POST["film_description"]
        film_date = request.POST["film_age"]
        film_director = request.POST["film_director"]
        film_actors = request.POST["film_actors"]
        film_poster = request.POST["film_poster"]
        film_rating = request.POST["film_rating"]
        film_genres = request.POST["film_genres"].split(",")

        if not Film.objects.filter(name__iexact=film_name).exists():
            film = Film(name=film_name, url=film_url, description=film_description, date=film_date,
                        director=film_director, actors=film_actors,
                        poster="http://image.tmdb.org/t/p/w342" + film_poster, rating=film_rating)
            film.save()

            for genre_name in film_genres:
                if not Genre.objects.filter(name__iexact=genre_name).exists():
                    genre = Genre(name=genre_name)
                    genre.save()
                else:
                    genre = Genre.objects.get(name__iexact=genre_name)

                film.genres.add(genre)

        else:
            film = Film.objects.get(name__iexact=film_name)
            film.url = film_url
            film.description = film_description
            film.date = film_date
            film.director = film_director
            film.actors = film_actors
            film.poster = film_poster
            film.rating = film_rating
            film.save()

        return redirect("dashboard")

    return HttpResponse("Nothing")


@login_required(login_url="login")
def delete_film(request):
    if not request.session["is_staff"]:
        return redirect("dashboard")

    if request.method == "GET":
        return render(request, "delete_film.html")

    elif request.method == "POST":
        film_name = request.POST["film_name"]

        if Film.objects.filter(name__iexact=film_name).exists():
            Film.objects.get(name__iexact=film_name).delete()
            return redirect("dashboard")

        else:
            context = {"error": "This film does not exists", "film_name": film_name}
            return render(request, "delete_film.html", context)

    return HttpResponse("Nothing")


@login_required(login_url="login")
def post_user(request):
    if not request.session["is_staff"]:
        return redirect("dashboard")

    if request.method == "GET":
        return render(request, "post_user.html")

    elif request.method == "POST":
        user_name = request.POST["user_name"]
        user_email = request.POST["user_email"]
        user_password = request.POST["user_password"]
        user_is_admin = request.POST["user_is_admin"]

        if not User.objects.filter(username__iexact=user_name).exists():
            user = User(username=user_name, email=user_email)
            user.set_password(user_password)
            user.save()

            if user_is_admin == "admin":
                user.is_staff = True
            else:
                user.is_staff = False

        else:
            user = User.objects.get(username__iexact=user_name)
            user.email = user_email
            user.set_password(user_password)
            user.save()

        return redirect("dashboard")

    return HttpResponse("Nothing")


@login_required(login_url="login")
def delete_user(request):
    if not request.session["is_staff"]:
        return redirect("dashboard")

    if request.method == "GET":
        return render(request, "delete_user.html")

    elif request.method == "POST":
        user_name = request.POST["user_name"]
        if User.objects.filter(username__iexact=user_name).exists():
            user = User.objects.get(username__iexact=user_name)
            user.delete()
            return redirect("dashboard")

        elif request.user.username == user_name:
            context = {"error": "You cannot delete your own user", "user_name": user_name}
            return render(request, "delete_user.html", context)

        else:
            context = {"error": "This user does not exists", "user_name": user_name}
            return render(request, "delete_user.html", context)

    return HttpResponse("Nothing")
