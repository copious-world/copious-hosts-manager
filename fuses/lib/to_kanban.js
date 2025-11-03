const fs = require('fs')





class ToKanban {

    constructor() {
        this.file = false
        this.original_text = ""
        this.stop_chars = ["#"]
        this.replace_chars = ["#"]
        this.sect_tag = "A"
        this.object = {}

        this.title
    }

    read_text_file(name) {
        this.file = name
        this.original_text = fs.readFileSync(name).toString()
    }

    set_stop_chars(clist,replacements) {
        this.stop_chars = [].concat(clist)
        this.replace_chars = replacements
    }


    focus_section(tag) {
        this.sect_tag = `${tag})`
    }

    parse_to_Json() {
        let text = this.original_text
        let sects = text.split(this.sect_tag)
        let focus = sects[1]
        if ( focus ) {
            //
            focus = focus.trim()
            //
            let lines = focus.split("\n")
            this.title = lines.shift().trim()
            this.object.title = this.title
            //
            let card = {}
            for ( let line of lines ) {
                //
                if ( this.stop_chars.indexOf(line[0]) >= 0 ) {
                    if ( card.title ) {
                        this.object[card.title] = card
                    }
                    card = {
                        title : line.substring(1).trim(),
                        description : ""
                    }
                } else {
                    let stoppable = false
                    for ( let c of this.stop_chars ) {
                        if ( line.indexOf(c) > 0 ) {
                            stoppable = true;
                        }
                    }
                    if ( stoppable) {
                        //
                        for ( let c of this.stop_chars ) {
                            let replacement = this.replace_chars[c]
                            line = line.replace(c,replacement)
                        }
                        //
                        card.description += "<br>" + line.trimEnd()
                    } else {
                        line = line.trim()
                        card.description += " " + line.trim()
                    }
                }
                //
            }
            //
            if ( card.title ) {
                this.object[card.title] = card
            }
            //
        } else {
            console.log("no focus section")
        }
    }

    get_object_print() {
        return JSON.stringify(this.object,null,2)
    }

}



module.exports = new ToKanban()