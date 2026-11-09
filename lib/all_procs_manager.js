
const ProcManager = require('./parent_proc_ops')

class AllProcsManager {

    constructor(conf) {
        this._conf = conf
        this._proc_managers = {}    // These are records managing running procs,
                                    // and the running procs have to have some representation in the config
        this.NodeInterface = ProcManager
    }

    get_proc_managers() {
        return this._proc_managers
    }

    clone_proc_managers() {
       return JSON.parse(JSON.stringify(this._proc_managers))
    }

    /**
     * #_read_node_class
     * 
     * Expect that a type of node will be requested by a configuration.
     * Find the type of node in the type directory if `node_type` field is not already an application provided class.
     * 
     * On failing to create a node, create a default type of node.
    */
    #_read_node_class(conf) {
        let NodeInterface = this.NodeInterface;
        if ( (conf !== undefined) && ( conf.node_type !== undefined) ) {
            if ( typeof conf.node_type !== 'string' ) {
                NodeInterface = conf.node_type;
            } else {
                NodeInterface = require(`${conf.node_type_dir}/${conf.node_type}`)
            }
        }
        return NodeInterface
    }


    /**
     * add_one_new_proc
     * 
     * Adds a new process to the table of managed processes if there is no entry for the proc name.
     * Spawns the process. And, this will update the configuration entry for later runs.
     * 
     * If the process being spawned is to be launched by a child of the calling process, the class of the grandchild process
     * should call upon a running child to launch it. The configuration, `proc` should include access to the child 
     * that launches the grandchild. The `spawn_child` method of the grandchild NodeInterface class
     * should be written to handle he relationships between the child and the grandchild.
     * 
     * Sibling child classes that communicate by a means known peculiar to them, should also provde a `spawn_child` method 
     * that knows how to introduce the communication links used by the siblngs. 
     * 
     * @param {object} proc - a descriptor of a proc, and also the configuration for it.
     * @param {string} proc_name - a table used by the manager to access the proc handle for process control
     * @param {object} conf - the configuration of the calling process that retain a list of proces known to it in the field, `all_procs`.
     * @returns boolean - true if the table of processes does not already have an entry 
     */
    add_one_new_proc(proc,proc_name) {
        let NodeInterface = this.#_read_node_class(proc)
        //
        if ( this._proc_managers[proc_name] === undefined ) {
            //
            let shared_mem_table = new NodeInterface(proc)
            shared_mem_table.spawn_child(proc)
            //
            this._proc_managers[proc_name] = shared_mem_table
            if ( this._conf.all_procs[proc_name] === undefined ) {
                this._conf.all_procs[proc_name] = proc
            }
            //
            return true;
        } else {
            return false;
        }
    }


    /**
     * #_add_one_dormant_proc
     * 
     * A private method that adds a process descriptor to the configuration, but does not launch the process.
     * 
     * 
     * @param {object} proc - the configuration object passed to the constructor of the class object that manages a process.
     * @param {string} proc_name - the name of the process in the caller's configuration
     * @param {object} conf - the caller's configuration
     */
    #_add_one_dormant_proc(proc,proc_name) {
        let NodeInterface = this.#_read_node_class(proc)
        //
        let shared_mem_table = new NodeInterface(proc)
        this._proc_managers[proc_name] = shared_mem_table
        if ( this._conf.all_procs[proc_name] === undefined ) {
            this._conf.all_procs[proc_name] = proc
        }
    }
    
    /**
     * update_one_proc
     * 
     * Whether the process is running or not, this method changes the proc descriptor
     * and it passes on the proc configuration to running processes by a call to `set_conf`.
     * 
     * @param {object} proc 
     * @param {string} proc_name 
     * @param {object} conf 
     */
    update_one_proc(proc,proc_name) {
        let shared_mem_table = this._proc_managers[proc_name]
        if ( shared_mem_table && this._conf.all_procs[proc_name] ) {
            this._conf.all_procs[proc_name] = proc
            shared_mem_table.set_conf(proc)
        }
        if ( this._conf.all_procs[proc_name] === undefined ) {
            console.log("attempting to update a nonexistant proc")
            console.log(proc_name)
            console.dir(proc)
            console.dir(this._conf.all_procs)
        }
    }

    
    /**
     * initialize_dormant_children
     * 
     * Initializes all processes in the proc table unless `only_dormant` is set to true.
     * If `only_dormant` is set to true, then this method only initializes process that are not running.
     * 
     * @param {object} conf 
     * @param {boolean} only_dormant - if true, then only process that are not running will be initialized
     */
    initialize_dormant_children(only_dormant = true) {
        only_dormant = (only_dormant === undefined) ? true : only_dormant
        let proc_list = this._conf.all_procs
        //
        for ( let proc_name in proc_list ) {
            let proc = proc_list[proc_name]
            if ( proc.run_on_start && !(only_dormant) ) {
                this.add_one_new_proc(proc,proc_name)
            } else {
                this.#_add_one_dormant_proc(proc,proc_name)
            }
        }
    }

    /**
     * initialize_children
     * 
     * Calls `initialize_dormant_children` with `only_dormant` set to false
     * 
     * @param {object} conf 
     */
    initialize_children() {
        this.initialize_dormant_children(this._conf,false)
    }
    
    /**
     * stop_and_remove_from_config
     * 
     * @param {string} proc_name 
     */
    stop_and_remove_from_config(proc_name) {
        this.remove_proc(proc_name,this._conf)
        if ( this._conf.all_procs[proc_name] !== undefined ) {
            delete this._conf.all_procs[proc_name]
            unload_json_file("manager.conf",this._conf)
        }
    }

    /**
     * remove_proc
     * 
     * Removes reference to a process descriptor from the application configuration's `all_procs` table
     * and it call upon the `stop_proc` method of the managing class.
     * 
     * @param {string} proc_name 
     * @param {object} conf 
     */
    remove_proc(proc_name) {
        let proc_m = this._proc_managers[proc_name]
        if ( proc_m ) {
            delete this._proc_managers[proc_name]
            proc_m.stop_proc()
            return true
        }
    }


    /**
     * stop_proc 
     * 
     * Stops a process from running. Leaves this process in the map of managed processes
     * @param {string} proc_name 
     * @returns 
     */
    stop_proc(proc_name) {
        let proc_m = this._proc_managers[proc_name]
        if ( proc_m ) {
            proc_m.stop_proc()
            return true
        }
        return false
    }

    /**
     * run_proc
     * 
     * @param {string} proc_name 
     * @param {boolean} if_running 
     * @param {boolean} use_debugger 
     * @returns 
     */
    run_proc(proc_name,if_running,use_debugger = false,relay_callback = false) {
        let proc_m = this._proc_managers[proc_name]
        if ( proc_m ) proc_m.run_proc(if_running,use_debugger,relay_callback)
        else {
            console.log("no proc: " + proc_name)
            console.log(Object.keys(this._proc_managers))
            return false
        }
        return true
    }

    /**
     * restart_proc
     * 
     * @param {string} proc_name 
     * @returns 
     */
    restart_proc(proc_name){
        let proc_m = this._proc_managers[proc_name]
        if ( proc_m ) { proc_m.restart_proc() }
        return true
    }


    /**
     * stop_all
     * 
     * 
     */
    stop_all() {
        for ( let proc_name in this._proc_managers ) {
            let proc_m = this._proc_managers[proc_name]
            if ( proc_m ) {
                proc_m.stop_proc()
            }    
        }
    }
}



module.exports = AllProcsManager;