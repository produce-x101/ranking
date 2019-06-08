var app = new Vue({
    el: '#app',
    data: {
        dataURL: "https://produce-x101.github.io/ranking/data/data.json",
        dataTable: [],
        UpArrow: "<span style=\"color: Green;font-size: 0.6rem;\"><i class=\"fa fa-caret-up\"></i></span>",
        DownArrow: "<span style=\"color: Red;font-size: 0.6rem;\"><i class=\"fa fa-caret-down\"></i></span>",
        EqualArrow: "<span style=\"color: Yellow;font-size: 0.4rem;\"><i class=\"fas fa-equals\"></i></span>",
        columnSort: {
            "name": null,
            "company": null,
            "evaluation": null,
            "reevaluation": null,
            "rankEp1": null,
            "rankEp2": null,
            "rankEp3": null
        },
        sortUp: "▴",
        sortDown: "▾",
        currentRow: {}
    },
    filters: {},
    methods: {
        getSortIcon: function (value) {
            var currentSorting = this.columnSort[value];
            if (currentSorting == null) {
                return "";
            }
            else if (currentSorting) {
                return this.sortUp;
            }
            else {
                return this.sortDown;
            }

        },
        toggleSorting: function (value) {
            var sortBy = function (field, reverse, primer) {
                var key = primer ?
                    function (x) { return primer(x[field]) } :
                    function (x) { return x[field] };

                reverse = !reverse ? 1 : -1;
                return function (a, b) {
                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                }
            }

            var reverse = this.columnSort[value];

            this.dataTable.sort(sortBy(value, reverse, function (t) {
                return t;
            }));

            this.columnSort[value] = !reverse;

            for (var key in this.columnSort) {
                if (key != value) {
                    this.columnSort[key] = null;
                }
            }
        },
        getLetter: function (value) {

            if (value == "?") {
                return "<p data-unknown=\"" + value + "\"></p>";;
            }

            return "<p data-" + value + "=\"" + value + "\"></p>";;
        },
        getRank(row, currentEp) {
            var rankBefore = row["rankEp" + (currentEp - 1)];
            
            if (currentEp == 5) rankBefore = row["rankEp" + 3];

            var rankNow = row["rankEp" + currentEp];

            if (row["droppedAt"] != null && row["droppedAt"] < currentEp) {
                return "-";
            }

            var html = "";
            if (rankBefore > rankNow) {
                var difference = rankBefore - rankNow;
                html = rankNow + "&nbsp;&nbsp;" + this.UpArrow + "&nbsp;<font color='green' size='0.5'>" + difference + "</font>";

            }
            else if (rankBefore < rankNow) {
                var difference = rankNow - rankBefore;
                html = rankNow + "&nbsp;&nbsp;" + this.DownArrow + "&nbsp;<font color='red' size='0.5'>" + difference + "</font>";
            }
            else {
                html = rankNow + "&nbsp;&nbsp;" + this.EqualArrow;
            }

            return html;
        },
        init() {
            fetch(this.dataURL)
                .then((res) => {
                    return res.json();
                }).then(json => {
                    for (var k in json) {
                        this.dataTable.push(json[k]);
                    }
                    this.toggleSorting('rankEp6');
                });
        }
    },
    mounted() {
        this.init();
    }
});
