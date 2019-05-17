var MONTHS = new Array("OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK");
var DAYS = new Array("PAZAR", "PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE", "CUMA", "CUMARTESİ");

function timer() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();
    var weekday = now.getDay();

    if (now.getHours() < 10)
        hours = "0" + now.getHours();
    else
        hours = now.getHours();
    if (now.getMinutes() < 10)
        minutes = "0" + now.getMinutes();
    else
        minutes = now.getMinutes();

    if (now.getSeconds() < 10)
        seconds = "0" + now.getSeconds();
    else
        seconds = now.getSeconds();

    var tarih = day + " " + MONTHS[month] + " " + year;
    var saat = hours + ":" + minutes + ":" + seconds;

    document.getElementById("tarih").innerHTML = tarih;
    document.getElementById("gun").innerHTML = DAYS[weekday];
    document.getElementById("saat").innerHTML = saat;
}

// Send ajax request and run func parameter
function sendAjaxRequest(func) {
    var xhttp = new XMLHttpRequest();
    var url = "http://192.168.1.107:8001/api/v1/panel/1/";
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = func;
}

function loadDoc() {
    sendAjaxRequest(function () {
        if (this.readyState == 4 && this.status == 200) {
            var panel = JSON.parse(this.responseText);
            document.getElementById("favicon").href = panel["icon"];
            document.getElementById("uni_logo").src = panel["icon"];
            document.getElementById("title").innerHTML = panel["title"];
            var city = panel["weather_city"];
            loadWeatherData(city);

            var sliding_texts = panel["sliding_texts"];
            var sliding_text = "";
            var i = 0;
            sliding_texts.forEach(element => {
                sliding_text += element["text"];
                if (i != sliding_texts.length - 1)
                    sliding_text += " &nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;";
                i++;
            });
            document.getElementById("kayan_yazi_duyuru").innerHTML = sliding_text;

            var activities = panel["activities"];
            loadActivities(activities);

            var classes = panel["classes"];
            loadClasses(classes);
        }
    });
}

function loadClasses(par_classes) {
    var classes = par_classes;

    var class_slide = document.getElementById('class_slide');
    while (class_slide.firstChild) {
        class_slide.removeChild(class_slide.firstChild);
    }

    var i;
    for (i = 0; i < classes.length; i++) {
        var day = classes[i]["day"];

        if (day.toUpperCase() == DAYS[new Date().getDay()]) {
            full_start = classes[i]["start_time"].split(":");
            full_end = classes[i]["end_time"].split(":");
            var start_time = full_start[0] + ":" + full_start[1];
            var end_time = full_end[0] + ":" + full_end[1];

            var class_div = document.createElement('div');
            class_div.classList.add('item');
            if (i == 0) class_div.classList.add('active');

            var class_p_baslik = document.createElement('p');
            class_p_baslik.classList.add('sagbaslikalti');
            class_p_baslik.classList.add('sag_baslik');
            class_p_baslik.innerHTML = classes[i]["title"];

            var class_p_sahip = document.createElement('p');
            class_p_sahip.classList.add('sag_icerik_orta');
            class_p_sahip.innerHTML = classes[i]["owner"];

            var class_p_day = document.createElement('p');
            class_p_day.classList.add('sag_icerik_orta');
            class_p_day.innerHTML = day;

            var class_p_tarih = document.createElement('p');
            class_p_tarih.classList.add('sag_icerik_orta');
            class_p_tarih.innerHTML = start_time + " - " + end_time;

            var class_p_adres = document.createElement('p');
            class_p_adres.classList.add('sag_icerik_orta');
            class_p_adres.innerHTML = classes[i]["address"];

            class_div.appendChild(class_p_baslik);
            class_div.appendChild(class_p_sahip);
            class_div.appendChild(class_p_day);
            class_div.appendChild(class_p_tarih);
            class_div.appendChild(class_p_adres);
            class_slide.appendChild(class_div);
        }
    }
}

function loadActivities(par_activities) {
    var activities = par_activities;

    var etkinlik_slide = document.getElementById('etkinlik_slide');
    while (etkinlik_slide.firstChild) {
        etkinlik_slide.removeChild(etkinlik_slide.firstChild);
    }

    var i;
    for (i = 0; i < activities.length; i++) {
        var date = new Date(activities[i]["date"].split("T")[0]);
        var time = activities[i]["date"].split("T")[1];
        var month = date.getMonth();
        var day = date.getDate();
        var weekday = date.getDay();
        var hour = time.split(":")[0];
        var minute = time.split(":")[1];

        var tarih = day + " " + MONTHS[month] + " " + DAYS[weekday];
        var saat = hour + ":" + minute;

        var etkinlik_div = document.createElement('div');
        etkinlik_div.classList.add('item');
        if (i == 0) etkinlik_div.classList.add('active');

        var etkinlik_p_baslik = document.createElement('p');
        etkinlik_p_baslik.classList.add('sagbaslikalti');
        etkinlik_p_baslik.classList.add('sag_baslik');
        etkinlik_p_baslik.innerHTML = activities[i]["title"];

        var etkinlik_p_sahip = document.createElement('p');
        etkinlik_p_sahip.classList.add('sag_icerik_orta');
        etkinlik_p_sahip.innerHTML = activities[i]["owner"];

        var etkinlik_p_tarih = document.createElement('p');
        etkinlik_p_tarih.classList.add('sag_icerik_orta');
        etkinlik_p_tarih.innerHTML = tarih + " - " + saat;

        var etkinlik_p_adres = document.createElement('p');
        etkinlik_p_adres.classList.add('sag_icerik_orta');
        etkinlik_p_adres.innerHTML = activities[i]["address"];

        etkinlik_div.appendChild(etkinlik_p_baslik);
        etkinlik_div.appendChild(etkinlik_p_sahip);
        etkinlik_div.appendChild(etkinlik_p_tarih);
        etkinlik_div.appendChild(etkinlik_p_adres);
        etkinlik_slide.appendChild(etkinlik_div);
    }
}

// LOAD MAIN VIDEO
function loadVideo() {
    sendAjaxRequest(function () {
        if (this.readyState == 4 && this.status == 200) {
            var panel = JSON.parse(this.responseText);

            var video = document.getElementById('video');
            var source = document.createElement('source');

            video.setAttribute('src', panel['video']);
            video.appendChild(source);
        }
    });
}

function loadWeatherData(city) {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?appid=7a31fdf28b96ec19bac9997103fa4c64&q=" + city,
        function (response) {
            // Convert Kelvin to Celcius
            document.getElementById("hava_durumu_derece").innerHTML = Math.round(response["main"]["temp"] - 273) + "°";
            document.getElementById("hava_durumu_sehir").innerHTML = city.toUpperCase();

            var weather = response["weather"][0]["main"];

            if (weather == "Rain") document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/1164/1164945.svg";
            else if (weather == "Clouds") document.getElementById("hava_durumu_icon").src = "https://www.duyurutv.com/temp/dosyalar/canliizle/hava_durumu/04n.svg";
            else if (weather == "Clear") document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/979/979585.svg";
            else if (weather == "Thunderstorm") document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/1164/1164947.svg";
            else if (weather == "Drizzle") document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/1113/1113757.svg";
            else if (weather == "Snow") document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/1164/1164958.svg";
            else document.getElementById("hava_durumu_icon").src = "https://image.flaticon.com/icons/svg/286/286588.svg";
        });
}

$(document).ready(function () {
    loadDoc();
    loadVideo();
    timer();
    setInterval(timer, 1000);
    setInterval(loadDoc, 12000);
});