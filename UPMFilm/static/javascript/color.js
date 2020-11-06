var colorController = {

    mode: null,

    initializeMode: function () {
        this.mode = localStorage.getItem('theme');
        if (this.mode == null || this.mode == "") {
            this.mode = 'dark';
            localStorage.setItem('theme', this.mode);
        } else if (this.mode == 'dark')
            this.setMode('light');
        else
            this.setMode('dark');
    },

    setMode(mode) {
        document.documentElement.setAttribute('data-theme', mode);
    },

    toggleMode: function () {
        this.mode = localStorage.getItem('theme')
        if (this.mode == 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'light');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'dark');
        }
    }
}

$(document).ready(function () {
    colorController.initializeMode();

    $("#color-button").click(function () {
        colorController.toggleMode();
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

});
