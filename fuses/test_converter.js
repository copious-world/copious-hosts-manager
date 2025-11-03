

let to_kb = require('./lib/to_kanban.js')


to_kb.set_stop_chars(["☐","☑","☒"],{
    "☐" : "&#129966;", "☑" : "&#9745;","☒" : "&#9746;"
})


to_kb.read_text_file('business--todo.txt')

to_kb.focus_section("C")

to_kb.parse_to_Json()

let output = to_kb.get_object_print()


console.log(output)