// contains functions to work with aviation edge apis
function TimeTable(code, direction) {

    this.code = code;
    this.direction = direction; // 'arrival' or 'departure
    this.AEURL = 'https://aviation-edge.com/api/public/timetable?';
    this.AEKEY = '8ab3ab-ceccc5-6b1b2c-8ca17c-7835cf';

    this.queryParams = {
        key: this.AEKEY
    };

    this.maxEntries = 10;
    this.entries;
    this.responseJSON = [];

    this.makeAEQueryString = function (code, type) {
        this.queryParams.iataCode = this.code;
        this.queryParams.type = this.direction;
        return this.AEURL + $.param(this.queryParams);
    };

    this.getTimeTable = function (code, type, limit, responseJSON) {
        var qstring = this.makeAEQueryString(code, type);

        return $.get(qstring)
            .done(function (resp) {
                var jsonTimeTable = JSON.parse(resp);

                for (var i = 0; i < limit;) {
                    if (jsonTimeTable[i].status === 'scheduled') {
                        responseJSON.push(jsonTimeTable[i]);
                        ++i;
                    }
                }
            }).fail(function(resp) {
                console.log('TimeTable lookup failed');
            });
    };

    this.getTimeTable(code, direction, this.maxEntries, this.responseJSON);
}