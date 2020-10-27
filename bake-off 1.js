/* ECE 209 Bake-off #1 Text Entry Interface
Yuhao Feng, Ruixiao Bai
Oct 24, 2020 @ ECE UCLA
© 2020 YF & RB. All rights reserved.*/

const keyboard = {
    keyboardLayout: ['Q','W','E','R','T','Y','U','I','O','nl',
                     'A','S','D','F','G','H','J','K','P','nl',
                     'Z','X','C','V','B','N','M','L'],
    keyboardColumns: {
        '0': ['Q','A','Z'],
        '1': ['W','S','X'],
        '2': ['E','D','C'],
        '3': ['R','F','V'],
        '4': ['T','G','B'],
        '5': ['Y','H','N'],
        '6': ['U','J','M'],
        '7': ['I','K','L'],
        '8': ['O','P']
    },
    defaultColumns: ['2', '6'],
    columnsHighlighted: [],

    initialize: function() {
        this.createKeyboard();
        this.toggleColumns('keyboardLayer', this.defaultColumns);
        this.columnsHighlighted = this.defaultColumns;
        this.createFilters();
    },
    createKeyboard: function() {
        $(`<div class="keyboardLayer"></div>`).insertBefore(".control-panel");
        this.keyboardLayout.forEach(function(key) {
            let keyHtml = key === 'nl' ?
                "<br/>" : `<div class="keyboard-key" id="key${key}">${key}</div>`;
            $(".keyboardLayer").append(keyHtml);
        });
    },
    toggleColumns: function(layer, columns) {
        let keyColumns = [];
        switch(layer) {
            case 'keyboardLayer':
                keyColumns = this.keyboardColumns;
                break;
            case 'filterLayer1':
                keyColumns = this.filter1Columns;
                break;
            case 'filterLayer2':
                keyColumns = this.filter2Columns;
                break;
        }
        for (column of columns) {
            keyColumns[column].forEach(function(key) {
                $(`.${layer}`).children(`#key${key}`).toggleClass('key-highlighted');
            });
        };
    },
    resetColumns: function() {
        for (column of this.columnsHighlighted) {
            this.keyboardColumns[column].forEach(function(key) {
                $(".keyboardLayer").children(`#key${key}`).toggleClass('key-highlighted');
            })
        }
        this.toggleColumns('keyboardLayer', this.defaultColumns);
        this.columnsHighlighted = this.defaultColumns;
        $("#space").removeClass("spaceEntered");
    },
    createFilters: function() {
        $(`<div class="filterLayer1"></div>`).insertAfter(".keyboardLayer");
        $(`<div class="filterLayer2"></div>`).insertAfter(".keyboardLayer");
    },

    filter1Columns: {'0': [], '1': []},
    filter1Highlighted: [],
    filter2Columns: {'0': [], '1': [], '2': []},
    filter2Highlighted: [],

    setFilter: function(filterNum) {
        let targetDOM = filterNum === 1 ?
            $(".keyboardLayer") : $(".filterLayer1");
        let keysInFilter = targetDOM.children(".key-highlighted").clone().toArray();
        let columnsToggle = [];
        if (filterNum===1) {
            this.filter1Columns['0'] = [];
            for (index of [0, 2, 4]) {
                this.filter1Columns['0'].push(keysInFilter[index]['id'][3]);
            }
            this.filter1Columns['1'] = [];
            let indices = keysInFilter.length === 6 ?
                    [1, 3, 5] : [1, 3];
            for (index of indices) {
                this.filter1Columns['1'].push(keysInFilter[index]['id'][3]);
            }
            this.filter1Highlighted = ['0'];
            columnsToggle = ['1'];
            keysInFilter.splice(1, 0, `<div class=keyboard-filler></div>`);
            keysInFilter.splice(3, 0, `<br/>`);
            keysInFilter.splice(5, 0, `<div class=keyboard-filler></div>`);
            keysInFilter.splice(7, 0, `<br/>`);
            keysInFilter.splice(9, 0, `<div class=keyboard-filler></div>`);
        }
        else if (filterNum===2) {
            let indices = keysInFilter.length === 3 ?
                    [0, 1, 2] : [0, 1];
            for (index of indices) {
                this.filter2Columns[index] = [keysInFilter[index]['id'][3]];
            }
            this.filter2Highlighted = ['1'];
            columnsToggle = keysInFilter.length === 3 ? 
                    ['0', '2'] : ['0'];
            keysInFilter.splice(1, 0, `<div class=keyboard-filler></div>`);
            keysInFilter.splice(3, 0, `<div class=keyboard-filler></div>`)

        }
        for (element of keysInFilter) {
            $(`.filterLayer${filterNum}`).append(element);
        }
        this.toggleColumns(`filterLayer${filterNum}`, columnsToggle);
    },
    clearFilter: function(filterNum) {
        $(`.filterLayer${filterNum}`).empty();
    },
    toggleFilter: function(filterNum) {
        $(`.filterLayer${filterNum}`).toggleClass("filterDisplayed")
    }
};

const textareaDOM = $("#textarea");

const controlPanel = {
    currentLayer: 'keyboardLayer',
    layerControl: function(action) {
        // actions that lead to layer transition
        switch(this.currentLayer) {
            case 'keyboardLayer':
                // action can only be 'enter'
                keyboard.setFilter(1);
                keyboard.toggleFilter(1);
                this.currentLayer = 'filterLayer1';
                break;
            case 'filterLayer1':
                // action can be 'backspace' or 'enter'
                if (action === 'backspace') {
                    keyboard.clearFilter(1);
                    keyboard.toggleFilter(1);
                    this.currentLayer = 'keyboardLayer';
                }
                else { // action 'enter'
                    keyboard.setFilter(2);
                    keyboard.toggleFilter(2);
                    keyboard.toggleFilter(1);
                    this.currentLayer = 'filterLayer2';
                }
                break;
            case 'filterLayer2':
                // action can be 'backspace' or 'enter'
                if (action === 'backspace') {
                    keyboard.clearFilter(2);
                    keyboard.toggleFilter(2);
                    keyboard.toggleFilter(1);
                    this.currentLayer = 'filterLayer1';
                }
                else { // action 'enter'
                    keyboard.clearFilter(2);
                    keyboard.clearFilter(1);
                    keyboard.toggleFilter(2);
                    this.currentLayer = 'keyboardLayer';
                    keyboard.resetColumns();
                }
                break;
        }
    },
    highlightControl: {
        keyboardLayer: {
            moveLeft: function() {
                let currentColumns = keyboard.columnsHighlighted;
                if (currentColumns.indexOf('0') === -1) {
                    keyboard.toggleColumns('keyboardLayer', currentColumns);
                    let columns = [];
                    for (column of currentColumns) {
                        columns.push(`${Number(column)-1}`);
                    }
                    keyboard.toggleColumns('keyboardLayer', columns);
                    keyboard.columnsHighlighted = columns;
                }
            },
            moveRight: function() {
                let currentColumns = keyboard.columnsHighlighted;
                if (currentColumns.indexOf('8') === -1) {
                    keyboard.toggleColumns('keyboardLayer', currentColumns);
                    let columns = [];
                    for (column of currentColumns) {
                        columns.push(`${Number(column)+1}`);
                    }
                    keyboard.toggleColumns('keyboardLayer', columns);
                    keyboard.columnsHighlighted = columns;
                }
            }
        },
        filterLayer1: {
            moveLeft: function() {
                if (keyboard.filter1Highlighted[0] === '1') {
                    keyboard.toggleColumns('filterLayer1', ['0', '1'])
                    keyboard.filter1Highlighted[0] = '0';
                }
            },
            moveRight: function() {
                if (keyboard.filter1Highlighted[0] === '0') {
                    keyboard.toggleColumns('filterLayer1', ['0', '1'])
                    keyboard.filter1Highlighted[0] = '1';
                }
            }
        },
        filterLayer2: {
            moveLeft: function() {
                let currentCol = keyboard.filter2Highlighted[0];
                if (currentCol !== '0') {
                    let newCol = String(Number(currentCol)-1);
                    keyboard.toggleColumns('filterLayer2', [currentCol, newCol]);
                    keyboard.filter2Highlighted[0] = newCol;
                }
            },
            moveRight: function() {
                let currentCol = keyboard.filter2Highlighted[0];
                if (currentCol !== '2') {
                    let newCol = String(Number(currentCol)+1);
                    keyboard.toggleColumns('filterLayer2', [currentCol, newCol]);
                    keyboard.filter2Highlighted[0] = newCol;
                }
            }
        }
    },

    textControl: {
        backspace: function() {
            textareaDOM.val(textareaDOM.val().slice(0, -1));
        },
        enter: function() {
            let text = $(".filterLayer2").find(".key-highlighted").attr('id')[3];
            let capslockClasses = $("#capslock").attr('class').split(' ');
            text = capslockClasses.includes('capslock-active') ?
                    text : text.toLowerCase();
            textareaDOM.val(textareaDOM.val() + text);
        },
        space: function() {
            textareaDOM.val(textareaDOM.val() + ' ');
            $("#space").addClass("spaceEntered");
        }
    },

    eventHandler: function(event) {
        let buttonID = event.target.parentElement.id;
        switch(buttonID) {
            case 'backspace':
                if (this.currentLayer === 'keyboardLayer') {
                    // if press backspace at keyboardLayer, simply do backspace
                    this.textControl.backspace();
                    $("#space").removeClass("spaceEntered");
                }
                else {
                    // else press backspace at filter layers, do layerControl
                    this.layerControl('backspace');
                }
                break;
            case 'capslock':
                $("#capslock").toggleClass("capslock-active");
                break;
            case 'enter':
                // if press enter at filterLayer2, enter text, then do layerControl
                // if press enter at other layers, do only layerControl
                if (this.currentLayer === 'filterLayer2') {
                    this.textControl.enter();
                }
                this.layerControl('enter');
                break;
            case 'space':
                // if press space at keyboardLayer, enter space
                // if press space at other layers, do nothing
                if (this.currentLayer === 'keyboardLayer') {
                    this.textControl.space();
                }
                break;
            case 'left':
                this.highlightControl[this.currentLayer].moveLeft();
                break;
            case 'right':
                this.highlightControl[this.currentLayer].moveRight();
                break;
        }
    }
};
keyboard.initialize();
$('button').on('click', (e) => {
    controlPanel.eventHandler(e);
});