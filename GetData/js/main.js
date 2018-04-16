function Song(title, artist) {
    this.title = title;
    this.artist = artist;
    this.id = "";
}

// Call API:https://api.spotify.com/v1/search?q=track%3ALac%20troi%20artist%3ASon%20Tung%20MTP&type=track
let token = "BQC6HXo3OOU8WEBQ0x1PIA4VDY-eCqJgZVF6mu11yvX7JBJsleIQR0z5RUK5y4OIVnLMMDJu2fsTr3IdDRDM-Ld-ebzmI_pWegX5W1QmGARzTgITOHvktVTIDqt4Ju73lL4vyWxUIpICToQacNv_z256cnkTQrQfl7ZiOU0oHbHmjArsd3i7VkH9Z8fg1sb8keClEB40cQBzXga7ZtyQZuWspTbbnfMlgNiE7Mn1WtaVoLqo9x72hT6aSNw6cd5cznVoWKUrDLdIIJpaQfIorF00IiY";
let Authorization = "Bearer BQBgcH-EpQs6rZqIR3iQ-V9DNuMSRGdR8W1G4fZI2Jw4YAC_QjTisLS-F5CEG_07u244p5sbhaS-CHqcnDhCej-1kICgT58bAsXQQvuWgPBU1q9lReasncVlZffOGvXla7oRkNDoIHujuGdyjwE8ssrl1h5ufhoK0NAA2GQMAgjf4NgdJ2cf";

// send Get ID
function GetId(song) {
    return new Promise(resolve => {
        var linkRequest = "https://api.spotify.com/v1/search?q=track:" + song.title + " artist:" + song.artist + "&type=track";
        var xhttp = new XMLHttpRequest();

        function reqListener() {
            resolve(JSON.parse(this.responseText));
            if (this.readyState === 4 && this.status === 200) {
                var parsedData = JSON.parse(this.responseText);
                song.id = parsedData.tracks.items[0].id;
                GetFeatures(song);
                GetAnalysis(song);
            } else {

            }
        }

        xhttp.addEventListener("load", reqListener);
        xhttp.open("GET", linkRequest, true);
        xhttp.setRequestHeader("Authorization", Authorization);
        xhttp.send();
    });

}

// Call API: https://api.spotify.com/v1/audio-features/6fOA679zqMJA4trVm3mE6G
// Get Audio Features for a Track
function GetFeatures(song) {
    return new Promise(resolve => {
        var linkRequest = "https://api.spotify.com/v1/audio-features/" + song.id;
        var xhttp = new XMLHttpRequest();

        function reqListener() {
            resolve(JSON.parse(this.responseText));
            if (this.readyState === 4 && this.status === 200) {
                var parsedData = JSON.parse(this.responseText);
                // console.log(parsedData);
            } else {

            }
        }

        xhttp.addEventListener("load", reqListener);
        xhttp.open("GET", linkRequest, true);
        xhttp.setRequestHeader("Authorization", Authorization);
        xhttp.send();
    });
}

// Call API: https://api.spotify.com/v1/audio-analysis/2RPNCUaDL2ixoY9wGpoJoQ
// Get Audio Analysis for a Track
function GetAnalysis(song) {
    return new Promise(resolve => {
        var linkRequest = "https://api.spotify.com/v1/audio-analysis/" + song.id;
        var xhttp = new XMLHttpRequest();

        function reqListener() {
            resolve(JSON.parse(this.responseText));
            if (this.readyState === 4 && this.status === 200) {
                var parsedData = JSON.parse(this.responseText);
                // console.log(parsedData);
            } else {

            }
        }

        xhttp.addEventListener("load", reqListener);
        xhttp.open("GET", linkRequest, true);
        xhttp.setRequestHeader("Authorization", Authorization);
        xhttp.send();
    });
}


var data = [];
var dataResult = [];

function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var promises = [];
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            data = results.data;
            var song = data[0];
            promises.push(GetId(song));
            GetId(song);
            dataResult.push(song);
            var result = CSV(dataResult);
            exportFile(result, "data.csv");
        }
    });
}

function CSV(songs) {
    var empConnects = [];
    songs.forEach(function (song) {
        empConnects.push([
            "\"" + song.title + "\"",
            "\"" + song.artist + "\"",
            "\"" + song.id + "\""
        ]);
    });
    if (empConnects.length < 1) {
        console.log("no data");
        return;
    }
    var csvContent = "data:text/csv;charset=utf-8,%EF%BB%BF";
    csvContent = "";
    empConnects.forEach(function (infoArray, index) {
        dataString = infoArray.join(",");
        csvContent += index < empConnects.length ? dataString : dataString;
        csvContent += "\n";
    });

    return csvContent;

}

function exportFile(data, filename) {

    if (!data) {
        console.error('Console.save: No data');
        return;
    }

    if (!filename) filename = 'console.json';

    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e)
}

$(document).ready(function () {
    $("#csv-file").change(handleFileSelect);
});
