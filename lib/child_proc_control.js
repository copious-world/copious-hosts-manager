

const {ParentIPCMessenger} = require('message-relay-services')
const {spawn_child} = require('./child_proc_spawner')


// ServerWithIPC
// IPCClient


/**
 * ChildProcControl
 * 
 * Objects defined by this class are stored in the `_proc_managers` table in the host process, either headless or web.
 * 
 */

class ChildProcControl extends ParentIPCMessenger {

    constructor(conf) {
        super(conf)
        this.c_proc = false
    }

    _init(conf) {}

    set_conf(conf) {
        this.conf = conf
    }

    /**
     * 
     * @returns {string|boolean} returns false is the configuration does not include a working directory
     */
    working_directory() {
        let w_dir = this.conf.working_directory
        if ( typeof w_dir === 'string' ) {
            return w_dir
        }
        return false
    }

    //
    parameters() {
        let args = [].concat(this.conf.args)
        if ( this.conf.runner ) {               // Take care of parameters
            if( this.conf.runner !== "node" ) {
                if ( Array.isArray(args) ) {
                    args.unshift(this.conf.runner)
                } else if ( typeof args === "string" ) {
                    if ( args.indexOf(',') > 0 ) {
                        args = args.split(',')
                        args.unshift(this.conf.runner)
                    } else {
                        args = [this.conf.runner,args]
                    }
                }
            } else {
                if ( Array.isArray(args) && (args[0] !== 'node') ) {
                    args.unshift("node")
                }
            }
        } else {
            if ( Array.isArray(args) && (args[0] !== 'node') ) {
                args.unshift("node")  // put node on the front
            } else if ( typeof args === "string" ) {
                if ( args.indexOf(',') > 0 ) {
                    args = args.split(',')
                    args.unshift('node')
                } else {
                    args = ['node',args]
                }
            }
        }
        return args
    }

    spawn_child() {
        //
        let args = this.parameters()
        let w_dir = this.working_directory()
        let c_proc = spawn_child(args,w_dir)
        this.c_proc = c_proc
        super.set_child_process(c_proc) // kept separate... assuming generalized code allow descendants to spawn
        this.child_controls(this,c_proc)
        //
    }

    stop_proc(as_promise) {
        if ( !(this.c_proc && this.c_proc.pid) ) return;
        if ( !this.running ) return
        //
        let result = true
        if ( as_promise ) {
            let self = this
            let close_promise = new Promise((resolve,reject) => {
                this.resolver = () => { resolve(true), self.resolver = false }
            })
            result = close_promise
        }
        process.kill(this.c_proc.pid,"SIGINT")
        return result
    }

    run_proc(if_running) {
        let run_it = true
        if ( if_running ) {
            if ( this.running ) {
                run_it = false
            }
        }
        if ( run_it ) {
            this.spawn_child()
        }
    }

    async restart_proc() {
        await this.stop_proc(true)
        this.run_proc(false)
    }

    _attempt_reconnect(conf) {
        this.spawn_child()
    }
}

module.exports = ChildProcControl
