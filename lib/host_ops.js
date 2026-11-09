
const {FileOperations} = require('extra-file-class')
const { exec } = require('child_process');
const {unload_json_file} = require('../lib/utils')


const TESTING = true;


class HostOps {

    constructor(conf,all_p) {
        this._conf = conf
        this._all_procs = all_p
        this.fos = new FileOperations(false)
        this._known_hosts = {}
        this.load_known_hosts(conf)
    }


    /**
     * 
     */
    reload_configuration() {
        let conf_str = this.fos.fs.readFileSync("manager.conf").toString()
        this._conf = JSON.parse(conf_str)
    }


    /**
     * 
     * @returns {object}
     */
    sendable_proc_data() {
        //
        let sendable = this._all_procs.clone_proc_managers()
        //
        for ( let ky in sendable ) {
            let descr = sendable[ky]
            delete descr.child_proc
            delete descr.key_value
            delete descr.session_key_value
            delete descr.static
        }
        //
        return sendable
    }
    

    /**
     * 
     * @param {string} password 
     * @returns {boolean}
     */
    check_admin_pass(password) {
        if ( this._conf.password === password ) {
            return true
        }
        return false
    }

    /**
     * 
     * @param {object} conf 
     */
    async load_known_hosts(conf) {
        this._known_hosts = await this.process_host_list(conf.host_support?.host_list);   // let it throw an exception if this is not here.
    }

    /**
     * 
     * @param {arr} array_of_hosts 
     */
    async unload_known_hosts(array_of_hosts) {
        let conf = this._conf.host_support
        let host_list_file = conf?.host_list
        this._known_hosts = array_of_hosts
        await this.fos.write_out_json(host_list_file,array_of_hosts)
    }
    

    /**
     * 
     * @param {string} host_list_file 
     * @returns 
     */
    async process_host_list(host_list_file) {
        if ( await this.fos.exists(host_list_file) ) {
            let hlist = await this.fos.json_data_reader(host_list_file)
            if ( hlist === undefined ) {
                throw new Error(`no host file ${host_list_file} contents`)
            }
            if ( Array.isArray(hlist) ) {
                return hlist
            } else {
                throw new Error(`no host file ${host_list_file} contents is not an array`)
            }
        }
        throw new Error(`no host file ${host_list_file}`)
    }


    /**
     * 
     * @returns {string}
     */
    get_known_hosts_as_string() {
        if ( TESTING ) {
            this.load_known_hosts(this._conf)
        }
        return JSON.stringify(this._known_hosts)
    }

    /**
     * 
     * @param {string} remote_op 
     * @param {object} obj 
     * @returns 
     */
    async ssh_get(remote_op,obj) {
        //
        switch ( remote_op ) {
            case "show-lan" : {
                let user = obj.user
                let address = obj.address
                let results = await this.get_hosts_on_remote_lan(user,address)
                obj.data = results
                return true;
            }
        }
        //
        return false
    }


    /**
     * 
     * @param {string} user 
     * @param {string} address 
     * @param {string} lan_mask 
     * @returns 
     */
    async get_hosts_on_remote_lan(user,address,lan_mask) {

        let cmd_list = `nmap -sn 192.168.1.0/24`
        if ( lan_mask !== undefined ) {
            cmd_list = `nmap -sn ${lan_mask}/24`
        }

        let ssh_command = `ssh ${user}@${address} "${cmd_list}"`


        return new Promise((resolve,reject) => {
    
            exec(ssh_command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                let output = stdout.split('\n')
                //
                output = output.filter((line) => {
                    return (line.indexOf("Nmap scan report for ") == 0);
                })
                //
                let olist = output.map(line => {
                    let slen = "Nmap scan report for ".length;
                    line = line.substring(slen)
                    return line
                })

                olist = olist.filter((line) => {
                    if ( line.indexOf(' (') > 0 ) {
                        return true
                    }
                    return false
                })
                //
                resolve(olist)
            });
        })
    
    }
    

    async get_hosts_on_lan(lan_mask) {

        let cmd_list = `nmap -sn 192.168.1.0/24`
        if ( lan_mask !== undefined ) {
            cmd_list = `nmap -sn ${lan_mask}/24`
        }
        return new Promise((resolve,reject) => {
    
            exec(cmd_list, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                let output = stdout.split('\n')
                //
                output = output.filter((line) => {
                    return (line.indexOf("Nmap scan report for ") == 0);
                })
                //
                let olist = output.map(line => {
                    let slen = "Nmap scan report for ".length;
                    line = line.substring(slen)
                    return line
                })
                //
                resolve(olist)
            });
        })
    
    }
    




    async get_file(obj,app_file) {
        let file = ""
        try {
            file = req.params.file
            let data = await fsPromise.readFile(app_file)
            let page = data.toString()
            obj.data = page
            return true
        } catch (e) {
            console.log(e)
        }
        return false
    }


    async get_app_file(obj) {
        let file = obj.file
        return await this.get_file(obj,`${__dirname}/app/${file}`)
    }

    async get_asset_file(obj) {
        let file = obj.file
        return await this.get_file(obj,`${__dirname}/app/assets/${file}`)
    }

    async get_build_file(obj) {
        let file = obj.file
        return await this.get_file(obj,`${__dirname}/app/build/${file}`)
    }
    
            
    app_procs(obj) {
        let sendable = this.sendable_proc_data()
        let output = JSON.stringify(sendable,"null",2)
        obj.data = output
        return true
    }
    

    app_host_list(obj) {
        if ( g_host_ops ) {
            let output = g_host_ops.get_known_hosts_as_string()
            obj.data = output
            return true
       }
       return false
    }


    async app_get_config(obj) {
        let file = decodeURIComponent(obj.enc_file)
        try {
            let data = await fsPromise.readFile(`./${file}`)
            obj.data = data.toString()
            return true
        } catch (e) {
            console.log("could not load the requested file" + file); 
        }
        return false
    }



    /**
     * 
     * @param {object} obj 
     * @returns {object|boolean}
     */

    async data_read_op(obj) {
        let admin_pass = obj.admin_pass
        let admin_OK = this.check_admin_pass(admin_pass)
        if ( admin_OK ) {
            //
            let operation = obj.op
            if ( operation ) {
                switch ( operation.name ) {
                    case "app-file" : {
                        return await this.get_app_file(obj)                    
                    }
                    case "asset-file" : {
                        return await this.get_asset_file(obj)                    
                    }
                    case "build-file" : {
                        return await this.get_build_file(obj)                    
                    }
                    case "all-procs" : {
                        return await this.app_procs(obj)                    
                    }
                    case "host-list" : {
                        return await this.app_host_list(obj)                   
                    }
                    case "get-config" : {
                        return await this.app_get_config(obj)                    
                    }
                    case "lan-hosts" : {
                        return await this.get_hosts_on_lan(obj.lan_mask)
                    }
                    default: {
                        break
                    }
                }
            }
        }
        return false
    }


    /**
     * 
     * @param {object} obj 
     * @returns {boolean}
     */
    async app_run_sys_op(obj,websocket_info_callback = false) {         /// set op
        let admin_pass = obj.admin_pass
        let admin_OK = this.check_admin_pass(admin_pass)
        if ( admin_OK ) {
            //
            let operation = obj.op
            if ( operation ) {
                switch ( operation.name ) {
                    case "add-proc" : {
                        let new_proc = operation.param.proc_def
                        let proc_name = operation.param.proc_name
                        this._all_procs.add_one_new_proc(new_proc,proc_name)
                        unload_json_file("manager.conf",this._conf)
                        return true
                    }
                    case "remove-proc" : {
                        return this._all_procs.stop_and_remove_from_config(operation.param.proc_name)
                    }
                    case "update-proc" : {
                        let new_proc = operation.param.proc_def
                        this._all_procs.update_one_proc(new_proc,operation.param.proc_name)
                        unload_json_file("manager.conf",this._conf)
                        return true
                    }
                    case "stop-proc" : {
                        let proc_name = operation.param.proc_name
                        return this._all_procs.stop_proc(proc_name)
                    }
                    case "run-proc" : {
                        let proc_name = operation.param.proc_name
                        let if_running = operation.param.if_running
                        let use_debugger = operation.param.use_debugger
                        return this._all_procs.run_proc(proc_name,if_running,use_debugger,websocket_info_callback)
                    }
                    case "restart-proc" : {
                        let proc_name = operation.param.proc_name
                        return this._all_procs.restart_proc(proc_name)
                    }
                    case "install" : {
                        // npm installer
                        break
                    }
                    case "remove" : {
                        // npm remove
                        return false
                    }
                    case "config" : {
                        let file = operation.param.file
                        let output = operation.param.config
                        try {
                            await fsPromise.writeFile(`./${file}`,output)
                            return true
                        } catch (e) {
                            console.log("could not load the requested file" + file); 
                        }
                        break
                    }
                    case "reload" : {
                        try {
                            this.reload_configuration()
                            console.log("configuration reloaded")
                            this._all_procs.initialize_dormant_children(this._conf)
                            return true
                        } catch (e) {
                            console.log(e)
                            console.log("could not reload app table"); 
                        }
                        break;
                    }
                    case "exec" : {
                        let cmd_obj = operation.param.proc_def
                        let cmd_list = `${cmd_obj.runner} ${cmd_obj.args}`
                        //
                        let p = new Promise((resolve,reject) => {
                            exec(cmd_list, (error, stdout, stderr) => {
                                if (error) {
                                    console.log(`error: ${error.message}`);
                                    resolve(false)
                                    return;
                                }
                                if (stderr) {
                                    console.log(`stderr: ${stderr}`);
                                    resolve(false)
                                    return;
                                }
                                // supposed to send it back to a listener on the web socket channel
                                let html_fix = stdout.split('\n').join('<br>')
                                html_fix = `<div>${html_fix}</div>`
                                obj.data = `stdout: ${html_fix}`
                                resolve(true)
                            });    
                        })
                        //
                        let status = await p;
                        // Run a short-lived command (bash script)
                        return status
                    }
    
                    case "stop-all" : {
                        this._all_procs.stop_all()
                        return true
                    }
                }
            }
            //
        }
        return false
    }
    
    
}




module.exports = HostOps

