

const fs = require('fs')


function find_git_repo(git_dir) {
    let head_log = `${git_dir}/logs/HEAD`
    if ( fs.existsSync(head_log) ) {
        let lines = fs.readFileSync(head_log).toString()
        lines = lines.split("\n")
        let line = lines[0]
        let parts = line.indexOf("clone:") > 0 ? line.split("clone:") : line.split("clone ")

        let remote = parts[1] ? parts[1].trim() : "unknown"
        let str = parts[0]
        let owner = str.substring(str.indexOf("<")+1,str.lastIndexOf(">"))

        if ( remote.indexOf("from ") === 0 ) {
            remote = remote.substring(5)
        }


        return [owner,remote]
    }
    return ["unknown","unknown"]
}


function dir_is_empty(git_dir) {
    let dir_list = fs.readdirSync(git_dir)
    return (dir_list.length === 0)
}



function list_git_directories_sync(top_level_dir,git_list) {

    let dir_list = fs.readdirSync(top_level_dir)

    git_list = git_list === undefined ? [] : git_list

    dir_list =  dir_list.filter((file) => {
        let stats = fs.lstatSync(`${top_level_dir}/${file}`);
        return ( stats.isDirectory() )
    })


    for ( let file of dir_list ) {
        //
        if ( file === "node_modules" ) continue;
        //
        // let path = `${top_level_dir}/${file}`        
        // console.log(path)
        //
        if ( fs.existsSync(`${top_level_dir}/.git`) ) {

            let empty_git = dir_is_empty(`${top_level_dir}/.git`)
            let [owner,remote] = empty_git ? ["unknown","unknown"] : find_git_repo(`${top_level_dir}/.git`)

            let dir_info = {
                "name" : `${top_level_dir}`,
                "is_empty" : empty_git,
                "owner" : owner,
                "remote" : remote
            }
            git_list.push(dir_info)
            break;
        } else {
            list_git_directories_sync(`${top_level_dir}/${file}`,git_list)
        }
        //
    }

    return git_list
    
}


//module.exports.list_git_directories = list_git_directories



async function test(top_level_dir) {
    let data = await list_git_directories_sync(top_level_dir)


    //let i = 0
    for ( let datum of data ) {
        //if ( datum.owner === "richardaleddy@gmail.com" )  continue;
        //console.log(++i,datum.name)
        let check = datum.remote.trim()
        // if ( check === "unknown" ) continue;
        // if ( check.indexOf("copious-world") > 0 || check.indexOf("rleddy") > 0 ) continue;
        //console.log(++i)
        console.dir(datum)
        console.log(",")
    }

}



test("/home/richard/GitHub")

