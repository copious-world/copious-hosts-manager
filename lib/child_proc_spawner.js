const {spawn, exec, execSync} = require('child_process');
const { resolve } = require('path');
const inspector = require('inspector')



function get_script_url_path(cli_bin_name) {

    let cmd1 = `which ${cli_bin_name}`
    try {
        //
        let result1 = execSync(cmd1).toString().trim()
        console.log(result1)
        //
        if ( result1.length ) {
            let cmd = `ls -l ${result1}`
            let result = execSync(cmd).toString().trim()
            console.log(result)
            let parseable = result.substring(result.indexOf('/')).trim()
            console.log(parseable)
            let ubin_path = result1.replace(cli_bin_name,'')
            let pkg_path = parseable.split('->')[1].trim()
            //
            let apath = resolve(ubin_path,pkg_path)
            return apath
        }
        //
    } catch (e) {
        console.log("no results")
    }

    return false
}



// devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/uuid-string

function open_browser(url) {
    //
    if ( url ) {
        const cleanWs = url.replace('ws://', '');
        const devToolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${cleanWs}`;

        console.log(`Opening Brave DevTools for Node.js...`);
        console.log(`Target: ${url}`);
        console.log(devToolsUrl)

        // 3. Open Brave depending on your Operating System
        let startCmd;
        if (process.platform === 'win32') {
            // Windows: uses the start protocol handler for Brave
            startCmd = `start brave "${devToolsUrl}"`;
        } else if (process.platform === 'darwin') {
            // macOS
            startCmd = `open -a "Brave Browser" "${devToolsUrl}"`;
        } else {
            // Linux
            startCmd = `brave-browser "${devToolsUrl}"`;
        }

        exec(startCmd, (err) => {
            if (err) {
                console.error('Failed to automatically open the browser:', err.message);
                console.log(`Please manually copy/paste this URL into your browser:\n${url}`);
            }
        });

    }

}

function get_browser_dev_tools_url(url) {
    if ( url ) {
        const cleanWs = url.replace('ws://', '');
        const devToolsUrl = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${cleanWs}`;

        console.log(`Target: ${url}`);
        console.log(devToolsUrl)
        return devToolsUrl
    }
    return false
}


function spawn_child(proc_name,w_dir = false,error_consumer = console.log,ouput_consumer = console.log,more_parameters = false) {
    let cproc = false
    let pars = []
    let opts = { "stdio" : ["pipe","pipe","pipe","ipc"]}
    if ( w_dir ) {
        opts.cwd = w_dir
    }
    let proc = false
    //
    if ( Array.isArray(proc_name) ) {
        proc = proc_name.shift()
        pars = proc_name
    } else {
        proc = 'node'        
    }

    if ( more_parameters ) {
        if ( Array.isArray(more_parameters) ) {
            pars = pars.concat(more_parameters)
        } else {
            pars.push(more_parameters)
        }
    }
    //
    cproc = spawn(proc,pars,opts)
    //
    if ( cproc ) {
        cproc.stderr.on('data',(data) => {
            error_consumer(data.toString())
        })
        cproc.stdout.on('data',(data) => {
            ouput_consumer(data.toString())
        })    
    }
    return cproc
}


module.exports.spawn_child = spawn_child





/**
 * 
 * @param {string} proc_name 
 * @param {string|boolean} w_dir 
 * @param {Function} error_consumer 
 * @param {Function} ouput_consumer 
 * @param {Array|string} more_parameters 
 * @returns {ref}
 */
function spawn_child_with_debugger(proc_name,w_dir = false,relay_callback = false,error_consumer = console.log,ouput_consumer = console.log,more_parameters = false) {
    //
    let browser_opened = false;
    //
    let cproc = false
    let pars = []
    let opts = { "stdio" : ["pipe","pipe","pipe","ipc"]}
    if ( w_dir ) {
        opts.cwd = w_dir
    }
    let proc = false
    //
    if ( Array.isArray(proc_name) ) {
        proc = proc_name.shift()
        pars = proc_name
    } else {
        proc = 'node'        
    }

    if ( more_parameters ) {
        if ( Array.isArray(more_parameters) ) {
            pars = pars.concat(more_parameters)
        } else {
            pars.push(more_parameters)
        }
    }
    //
    if ( proc !== 'node' ) {
        proc = get_script_url_path(proc)
        if ( proc !== false ) {
            pars.unshift(proc)
            proc = 'node'
        } else {
            return false
        }
    }
    //
    pars.unshift('--inspect-brk=0')
    cproc = spawn(proc,pars,opts)
    //
    if ( cproc ) {
        //
        cproc.stdout.on('data',(data) => {
            ouput_consumer(data.toString())
        })    
        //
        cproc.stderr.on('data',(data) => {
            //
            let output = data.toString()
            error_consumer(output)

            // Also forward the child's stderr to our main terminal so we don't lose logs
            process.stderr.write("debug stderr: " + output);

            if ( relay_callback && (typeof relay_callback === 'function') ) {
                // Look for the Chrome DevTools inspect URL pattern
                if ( !(browser_opened) && output.startsWith('Debugger listening on') ) {
                    browser_opened = true;
                    // Debugger listening on ws://127.0.0.1:41027/e207635b-2c8e-4a70-84b9-4c04925a716e
                    let inspect_url_prep = output.substring('Debugger listening on'.length).trim()
                    const inspect_url = inspect_url_prep.split('\n')[0].trim()

                    console.log(`\n🚀 Found debug URL! Launching browser inspector...`);
                    // 3. Open the specific DevTools window across different Operating Systems
                    const ws_url = get_browser_dev_tools_url(inspect_url);
                    relay_callback("debug_url",ws_url)
                }
            }
        })
    }

    return cproc
}


module.exports.spawn_child_with_debugger = spawn_child_with_debugger

