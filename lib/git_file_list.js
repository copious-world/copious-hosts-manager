




const fs_promises = require('extra-file-class')('git-ops')

async function list_git_directories(top_level_dir,git_list) {

    let dir_list = await fs_promises.read_dir(top_level_dir)
    git_list = git_list === undefined ? [] : git_list

    for ( let file of dir_list ) {
        if ( await fs_promises.is_dir(file) ) {
            if ( await fs_promises.exists_dir(`${top_level_dir}/.git`) ) {
                let dir_info = {
                    "name" : `${top_level_dir}/${file}`,
                    "is_empty" : (await fs_promises.is_empty(`${top_level_dir}/.git`) ),
                    "owner" :  (await fs_promises.repo_owner(`${top_level_dir}/.git`)),
                    "remote" : (await fs_promises.repo_remote_url(`${top_level_dir}/.git`))
                }
                git_list.push(dir_info)
            } else {
                await list_git_directories(`${top_level_dir}/${file}`,git_list)
            }
        }
    }

    return git_list    
}


module.exports.list_git_directories = list_git_directories


