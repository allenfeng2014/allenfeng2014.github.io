const keyboardLayout = 'QWERTYUIOASDFGHJKPZXCVBNML'.split('');
keyboardLayout.splice(keyboardLayout.indexOf('A'), 0, 'nl');
keyboardLayout.splice(keyboardLayout.indexOf('Z'), 0, 'nl');

keyboardLayout.forEach(function(key) {
    let keyHtml = key === 'nl' ? "<br/>" : `<div class="keyboard-key" id="key${key}">
                                                ${key}</div>`;
    $(".keyboard-keys").append(keyHtml);
})

const keyboard = {
    keyColumns: {
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

    toggleColumns: function(columns) {
        for (column of columns) {
            this.keyColumns[column].forEach(function(key) {
                $(`#key${key}`).toggleClass('key-highlighted');
            });
        };
        this.columnsHighlighted = columns;
    },
    highlightToLeft: function() {
        if (this.columnsHighlighted.indexOf('0') === -1) {
            this.toggleColumns(this.columnsHighlighted);
            let columns = [];
            for (column of this.columnsHighlighted) {
                columns.push(`${Number(column)-1}`);
            }
            this.toggleColumns(columns);
        }
    },
    highlightToRight: function() {
        if (this.columnsHighlighted.indexOf('8') === -1) {
            this.toggleColumns(this.columnsHighlighted);
            let columns = [];
            for (column of this.columnsHighlighted) {
                columns.push(`${Number(column)+1}`);
            }
            this.toggleColumns(columns);
        }
    }

};
keyboard.toggleColumns(keyboard.defaultColumns);

const textareaDOM = $("#textarea");

function controlFunction(buttonID) {
    let cursorPosition = textareaDOM.prop('selectionStart');
    let textArray = textareaDOM.val().split('');
    //textArray.splice(cursorPosition, 0, event.key.toUpperCase());
    //textareaDOM.val(textArray.join(''));
    switch(buttonID) {
        case 'backspace':
            textArray.splice(cursorPosition-1, 1, '');
            textareaDOM.val(textArray.join(''));
            break;
        case 'capslock':
            $("#capslock").toggleClass("capslock-active");
            break;
        case 'enter':
            textareaDOM.val(textareaDOM.val() + 'enter clicked');
            break;
        case 'space':
            textArray.splice(cursorPosition, 0, ' ');
            textareaDOM.val(textArray.join(''));
            break;
        case 'left':
            keyboard.highlightToLeft();
            break;
        case 'right':
            keyboard.highlightToRight();
            break;
        default:
            break;
    }
}

$('button').on('click', function(event) {
    let buttonID = event.target.parentElement.id;
    controlFunction(buttonID);
    textareaDOM.focus();
})

textareaDOM.on('keypress', function(event) {
    let capslockClasses = $("#capslock").attr('class').split(' ');
    if (capslockClasses.includes('capslock-active')) {
        event.preventDefault();
        let cursorPosition = textareaDOM.prop('selectionStart');
        let textArray = textareaDOM.val().split('');
        textArray.splice(cursorPosition, 0, event.key.toUpperCase());
        textareaDOM.val(textArray.join(''));
    }
});