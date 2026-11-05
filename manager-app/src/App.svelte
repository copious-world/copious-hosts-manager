<script>
	//	GOAL : manage id within a web browser
	//		 :		allow user interaction, local DB fucntion, etc. to allow uploading, downloading, and removing igid
	//		 :		from the "of-this.word" URL.
	//	SUPPORT ACTION : 		all action is within the browser...
	//
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import { onMount } from 'svelte';

	import MakeEntryDialog from './MakeEntryDialog.svelte'
	import ExecDialog from './ExecDialog.svelte'
	import NpmDialog from './ExecNpm.svelte'
	import EditConfDialog from './EditConfDialog.svelte'
	import { JsonView } from '@zerodevx/svelte-json-view'


	import Markdown from 'svelte-exmarkdown';
	//import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	

	let dialog_data = ""
	let conf_dialog_data = ""
	let exec_dialog_data = ""
	let npm_dialog_data = ""
	let dialog_update_data = ""


	let password_view_type = true
	//
	let console_output = "<b>console output</b><br>"


	let active_cwid = ""

	let prefix = '';
	let man_prefix = '';
	let i = 0;

	//
	let u_index = 0


	let active_procs = false
	let active_identity = false
	let known_procs = [false]
	let all_proc_data = {}

	let active_proc_name = ""
	let running_color = "green"
	let running_state = "running"


	let admin_pass = ""

	
	let manifest_selected_entry = false
	let manifest_selected_form = false
	let manifest_contact_form_list = [false]
	//
	let manifest_obj = {}
	let manifest_index = 0
	let man_cwid = ''

	let active = 'Identify';
	let prev_active = active
	let todays_date = (new Date()).toLocaleString()

	// This is just a default... It will be used until the user picks something else 
	// when editing the manifest.
	//
	let individuals = [
		{ "name": 'Hans Solo', "DOB" : "1000", "place_of_origin" : "alpha centauri", "cool_public_info" : "He is a Master Jedi", "business" : false, "public_key" : "testesttesttest", "signer_public_key" : "ha ha ha ha ha ha ha ", "cwid" : "4504385938", "answer_message" : "", "biometric" : "53535" }
	];

	let selected = individuals[0]


	function reinitialize_user_context() {
		// 
	}


	function navigate_to_proc() {
		// 
	}

	/*
      "wrapped_key" : false,
      "encoding" : "uri",
	  "when"  ... whereas"date" is a human readable string...
	*/

	//
	class Contact {
		//
		constructor() {
			this.empty_identity = {
				"name": '',
				"DOB" : "",
				"place_of_origin" : "", 
				"cool_public_info" : "", 
				"business" : false, 
				"public_key" : false,
				"signer_public_key" : false,
				"biometric" : false
			}
			this.data = this.empty_identity
		}
		//
		set(name,DOB,place_of_origin,cool_public_info,business,public_key,signer_public_key,biometric_blob) {
			let user_data = {
				"name": name,
				"DOB" : DOB,
				"place_of_origin" : place_of_origin, 
				"cool_public_info" : cool_public_info, 
				"business" : (business === undefined) ? false : business, 
				"public_key" : public_key,
				"signer_public_key" : signer_public_key,
				"biometric" : biometric_blob
			}
			this.data = user_data
		}

		copy(contact_info) {
			let data = {}
			for ( let ky in this.empty_identity ) {
				data[ky] = contact_info[ky]
			}
			this.data = data
		}

		match(contact_info) {
			let f_match = true
			f_match = f_match && ( this.data.name === contact_info.name )
			f_match = f_match && ( this.data.DOB === contact_info.DOB )
			f_match = f_match && ( this.data.place_of_origin === contact_info.place_of_origin )
			f_match = f_match && ( this.data.cool_public_info === contact_info.cool_public_info )
			f_match = f_match && ( this.data.business === contact_info.business )
			return f_match
		}
		
		extend_contact(field,value) {
			this.data[field] = value;
		}

		get_field(field) {
			return this.data[field]
		}

		identity() {
			let id_obj = Object.assign(this.empty_identity,this.data)
			return id_obj
		}

		clear_identity() {
			let id_obj = {
				"name": this.data.name,
				"DOB" : this.data.DOB,
				"place_of_origin" : this.data.place_of_origin, 
				"cool_public_info" : this.data.cool_public_info, 
				"business" : this.data.business, 
			}
			return id_obj
		}

	}

	let empty_identity = new Contact()

	//


	/*
	"test3.js": {
      "name": "test3.js",
      "run_on_start": true,
      "attempt_reconnect": false,
      "runner": "node",
      "args": "test3"
    }
	 */
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	//
	let show_dialog = "none"
	let add_promise = false
	const onCancel = () => {
		show_dialog = "none"
		if ( add_promise  && (typeof add_promise.rejector === 'function') ) {
			add_promise.rejector()
		}
	}
	
	const onOkay = (ddata) => {
		dialog_data = ddata
		console.log(ddata)
		show_dialog = "none"
		if ( add_promise  && (typeof add_promise.resolver === 'function') ) {
			add_promise.resolver()
		}
	}
	//
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


	async function proc_def_from_user() {
		show_dialog = "block"
		let p = new Promise((resolve,reject) => {
			add_promise = {
				resolver : () => { resolve(true); add_promise = false },
				rejector : () => { resolve(false); add_promise = false  }
			}
		})
		let do_process = await p
		if ( do_process ) {
			return(dialog_data)
		}
	}




	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	// 

	let show_update_dialog = "none"
	let add_update_promise = false
	const onUpdateCancel = () => {
		show_update_dialog = "none"
		if ( add_update_promise  && (typeof add_update_promise.rejector === 'function') ) {
			add_update_promise.rejector()
		}
	}
	
	const onUpdateOkay = (ddata) => {
		dialog_update_data = ddata
		console.log(ddata)
		show_update_dialog = "none"
		if ( add_update_promise  && (typeof add_update_promise.resolver === 'function') ) {
			add_update_promise.resolver()
		}
	}
	//
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


	async function update_def_from_user() {
		show_update_dialog = "block"
		let p = new Promise((resolve,reject) => {
			add_update_promise = {
				resolver : () => { resolve(true); add_promise = false },
				rejector : () => { resolve(false); add_promise = false  }
			}
		})
		let do_process = await p
		if ( do_process ) {
			return(dialog_update_data)
		}
	}



	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	// 


	let show_conf_dialog = "none"
	let add_conf_promise = false

	const onConfCancel = () => {
		show_conf_dialog = "none"
		if ( add_conf_promise  && (typeof add_conf_promise.rejector === 'function') ) {
			add_conf_promise.rejector()
		}
	}
	
	const onConfOkay = (text) => {
		console.log(text)
		show_conf_dialog = "none"
		if ( add_conf_promise  && (typeof add_conf_promise.resolver === 'function') ) {
			add_conf_promise.resolver()
		}
	}


	async function conf_def_from_user() {
		show_conf_dialog = "block"
		let p = new Promise((resolve,reject) => {
			add_conf_promise = {
				resolver : () => { resolve(true); add_conf_promise = false },
				rejector : () => { resolve(false); add_conf_promise = false  }
			}
		})
		let do_process = await p
		if ( do_process ) {
			return(conf_dialog_data)
		}
	}

	//
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----


	let show_exec_dialog = "none"

	let add_exec_promise = false
	const onExecCancel = () => {
		show_exec_dialog = "none"
		if ( add_exec_promise  && (typeof add_exec_promise.rejector === 'function') ) {
			add_exec_promise.rejector()
		}
	}
	
	const onExecOkay = () => {
		show_exec_dialog = "none"
		if ( add_exec_promise  && (typeof add_exec_promise.resolver === 'function') ) {
			add_exec_promise.resolver()
		}
	}
	//
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

	async function exec_def_from_user() {
		show_exec_dialog = "block"
		let p = new Promise((resolve,reject) => {
			add_exec_promise = {
				resolver : () => { resolve(true); add_exec_promise = false },
				rejector : () => { resolve(false); add_exec_promise = false  }
			}
		})
		let do_process = await p
		if ( do_process ) {
			return(exec_dialog_data)
		}
	}


	let show_npm_dialog = "none"

	let add_npm_promise = false
	const onNpmCancel = () => {
		show_npm_dialog = "none"
		if ( add_npm_promise  && (typeof add_npm_promise.rejector === 'function') ) {
			add_npm_promise.rejector()
		}
	}
	
	const onNpmOkay = () => {
		show_npm_dialog = "none"
		if ( add_npm_promise  && (typeof add_npm_promise.resolver === 'function') ) {
			add_npm_promise.resolver()
		}
	}
	//
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	let npm_action = "install"

	async function npm_def_from_user(action_choice) {
		npm_action = action_choice ? "install" : "remove"
		show_npm_dialog = "block"
		let p = new Promise((resolve,reject) => {
			add_npm_promise = {
				resolver : () => { resolve(true); add_npm_promise = false },
				rejector : () => { resolve(false); add_npm_promise = false  }
			}
		})
		let do_process = await p
		if ( do_process ) {
			return(npm_dialog_data)
		}
	}

	
	

	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----

	$: filteredIndviduals = prefix
		? individuals.filter(individual => {
			const name = `${individual.name}`;
			return name.toLowerCase().startsWith(prefix.toLowerCase());
		})
		: individuals;

	$: selected = (i >= 0) ? filteredIndviduals[i] : empty_identity.identity()

	$: reset_inputs(selected)

	//
	let active_proc_data = {}
	//
	$: active_procs = known_procs[u_index]
	$: {
		if ( active_procs ) {
			active_proc_name = active_procs.proc_name
			window.set_user_title(active_procs.proc_name)
			active_proc_data = Object.assign({},active_procs)

			if ( !(active_procs.running) ) {
				running_color = "darkred"
				running_state = "stopped"
			} else {
				running_color = "green"
				running_state = "running"
			}
		}
	}

	let current_index = -1


	$: {
		if ( (active_procs !== undefined) && active_procs ) {
		}
	}

	$: {
		if ( current_index !== u_index ) {
			current_index = u_index
			reinitialize_user_context()
		}
	}

	$: filtered_manifest_contact_form_list = man_prefix
		? manifest_contact_form_list.filter(man_contact => {
			const name = `${man_contact.name}`;
			return name.toLowerCase().startsWith(man_prefix.toLowerCase());
		})
		: manifest_contact_form_list;

	$: {
		manifest_selected_entry = filtered_manifest_contact_form_list[manifest_index]
		if ( (manifest_selected_entry !== undefined) && manifest_selected_entry ) {
			manifest_selected_form = manifest_selected_entry.html
			man_title = manifest_selected_entry.info
			man_max_preference = manifest_obj.max_preference
			man_preference = manifest_selected_entry.preference
			man_cwid = manifest_selected_entry.cwid

			man_contact_is_default = ( man_cwid === manifest_obj.default_contact_form)
		}
	}
						

	$: {
		if ( prev_active !== active ) {
			if ( active == "Introductions" ) {
			} else if ( active == "Messages" ) {
			}
		}
		prev_active = active
	}
	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
 
	let creation_to_do = false
	$: {
		creation_to_do = ( (u_index === false) || (active_procs && (active_procs.biometric === undefined)) )
		if ( (typeof active_cwid === "string") && (active_cwid.length === 0) ) {
			creation_to_do = true
		}
	}

	let window_scale = { "w" : 0.4, "h" : 0.8 }
	let edit_popup_scale = { "w" : 0.45, "h" : 0.3}

	let all_window_scales = []
	all_window_scales.push(window_scale)
	all_window_scales.push(window_scale)
	all_window_scales.push(edit_popup_scale)


	function popup_size() {
		let smallest_w = 200   // smallest and bigget willing to accomodate
		let biggest_w = 3000

		let smallest_h = 600
		let biggest_h = 1000

		// bounded window width
		let w = Math.max(smallest_w,window.innerWidth)
		w = Math.min(biggest_w,w)

		// bounded window height
		let h = Math.max(smallest_h,window.innerHeight)
		h = Math.min(biggest_h,h)

		let p_range
		let P
		//	percentage h range 
		let h_p_max = 0.96
		let h_p_min = 0.75
		p_range = h_p_max - h_p_min
		P = (biggest_h - h)/(biggest_h - smallest_h)
		//console.log("P h: " + P)
		let h_scale = P*(p_range) + h_p_min

		//	percentage w range 
		let w_p_max = 0.96
		let w_p_min = 0.20
		p_range = w_p_max - w_p_min
		P = (biggest_w - w)/(biggest_w - smallest_w)
		//console.log("P w: " + P)
		let w_scale = P*(p_range) + w_p_min

		// Setting the current height & width 
		// to the elements 

		return { "w" : w_scale, "h" : h_scale }
	}

	//
	window_scale = popup_size()
	all_window_scales[0] = window_scale
	all_window_scales[1] = window_scale

	//
	onMount(async () => {
		//
		window.addEventListener("resize", (e) => {
			//
			let scale = popup_size()
			//
			window_scale.h = scale.h; 
			window_scale.w = scale.w;
			all_window_scales[0] = window_scale
			all_window_scales[1] = window_scale
			//
		})

		window._expose_to_page = (data) => {
			known_procs = data[0]
			all_proc_data = data[1]
		}

		window._add_console_data = (message) => {
			console_output += message.data.join('<br>') + '<br>'
			while ( console_output.length > 10000 ) {
				console_output = console_output.substring(1000)
			}
		}

		await startup()
			// initialize
		await get_active_procs()  // updates login page and initializes the view of this user.
	})


// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 


	async function get_active_procs() {
		try {
			let [f_procs,f_data] = await fetch_procs_from_server()
			known_procs = f_procs
			all_proc_data = f_data
		} catch (e) {}
	}




// MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
// MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES

	function name_is_stem(pname,containing_str) {
		let stem = containing_str.substring(containing_str.lastIndexOf("/")+1)
		return (pname === stem)
	}

	function arg0_calculus(pname,proc_def) {
		let args = proc_def.args
		if ( !Array.isArray(args) ) {
			args = args.split(',')
		}
		if ( (args[0] !== pname) && !(name_is_stem(pname,args[0])) ) {
			if ( proc_def.runner === "node" ) {
				if ( (args[0] !== "--inspect") && (args[0] !== "--inspect-brk")  ) {
					args.unshift(pname)  // put the name into the array
				}
			}
			if ( proc_def.runner.length === 0 ) delete proc_def.runner
		}

		proc_def.args = args
	}

	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
	//

	function reset_inputs(individual) {
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function restart_proc() {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		let pname = active_proc_name
		let params = {
			"admin_pass" : admin_pass ,
			"op" : {
				"name" : "restart-proc",
				"param" : {
					"proc_name" : pname
				}
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
		} catch (e) {
			alert(e.message)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function run_proc() {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		let pname = active_proc_name
		let params = {
			"admin_pass" : admin_pass ,
			"op" : {
				"name" : "run-proc",
				"param" : {
					"proc_name" : pname,
					"if_running" : false
				}
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
		} catch (e) {
			alert(e.message)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function stop_proc() {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		let pname = active_proc_name
		let params = {
			"admin_pass" : admin_pass ,
			"op" : {
				"name" : "stop-proc",
				"param" : {
					"proc_name" : pname
				}
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
		} catch (e) {
			alert(e.message)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function stopall() {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		let params = {
			"admin_pass" : admin_pass ,
			"op" : {
				"name" : "stop-all"
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
		} catch (e) {
			alert(e.message)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function remove_entry() {

		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		let doit = confirm("Are you sure you want to remove this entry?")
		if ( !doit ) return

		let pname = active_proc_name
		let params = {
			"admin_pass" : admin_pass,
			"op" : {
				"name" : "remove-proc",
				"param" : {
					"proc_name" : pname
				}
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
		} catch (e) {
			alert(e.message)
		}
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function reload_all() {
		//
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		let params = {
			"admin_pass" : admin_pass,
			"op" : {
				"name" : "reload",
				"param" : {}
			}
		}
		try {
			let result = await post_proc_command(params)
			if ( !result ) alert("Error")
			await get_active_procs()
		} catch (e) {
			alert(e.message)
		}
		//
	}

	// ---- ---- ---- ---- ---- ---- ----
	async function add_entry() {
		//
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		let proc_def = await proc_def_from_user()
		if ( !(proc_def) ) return
		//
		let pname = proc_def.name
		arg0_calculus(pname,proc_def)


		if ( proc_def ) {
			let params = {
				"admin_pass" : admin_pass,
				"op" : {
					"name" : "add-proc",
					"param" : {
						"proc_name" : pname,
						"proc_def" : proc_def
					}
				}
			}
			try {
				let result = await post_proc_command(params)
				if ( !result ) alert("Error")
			} catch (e) {
				alert(e.message)
			}
		}
	}


	async function update_entry() {
		//
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		//
		dialog_update_data = Object.assign({},active_procs.conf)
		//
		let proc_def = await update_def_from_user()
		if ( !(proc_def) ) return
		//
		let pname = proc_def.name
		arg0_calculus(pname,proc_def)

		if ( proc_def ) {
			let params = {
				"admin_pass" : admin_pass,
				"op" : {
					"name" : "update-proc",
					"param" : {
						"proc_name" : pname,
						"proc_def" : proc_def
					}
				}
			}
			try {
				let result = await post_proc_command(params)
				if ( !result ) alert("Error")
			} catch (e) {
				alert(e.message)
			}
		}

	}

	// ---- ---- ---- ---- ---- ---- ----
	async function edit_app_config() {  // active_proc_data
		let entry_conf = active_proc_data.conf
		let config_file = false
		if ( entry_conf ) {
			let plist = entry_conf.args
			for (let p of plist) {
				if ( p.indexOf('.conf') > 0 ) {
					config_file = p
					break;
				}
			}
		} 
		//
		if ( !config_file ) {
			alert("no config file found")
			return;
		} else {
			let editable = confirm(`Is ${config_file} this apps config file?`)
			if ( !editable ) {
				alert("no config file found")
				return
			}
		}

		let editable_config = await fetch_app_config(config_file)
		if ( editable_config ) {
			conf_dialog_data = editable_config
		}

		let conf_def = await conf_def_from_user()
		if ( !(conf_def) ) return
		//
		let pname = active_proc_name

		if ( conf_def ) {
			let conf_def_str = JSON.stringify(conf_def)
			let params = {
				"admin_pass" : admin_pass,
				"op" : {
					"name" : "config",
					"param" : {
						"proc_name" : pname,
						"config" : conf_def_str,
						"file" : config_file
					}
				}
			}
			try {
				let result = await post_proc_command(params)
				if ( !result ) alert("Error")
			} catch (e) {
				alert(e.message)
			}
		}
	}



	


	// ---- ---- ---- ---- ---- ---- ----
	async function run_command() {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}
		let proc_def = await exec_def_from_user()
		if ( !(proc_def) ) return
		//
		if ( proc_def ) {
			let params = {
				"admin_pass" : admin_pass,
				"op" : {
					"name" : "exec",
					"param" : {
						"proc_def" : proc_def
					}
				}
			}
			try {
				let result = await post_proc_command(params)
				if ( !result ) alert("Error")
			} catch (e) {
				alert(e.message)
			}
		}
	}


	async function run_npm_command(action_choice) {
		if ( admin_pass.length === 0 ) {
			alert("no admin pass")
			return
		}

		let proc_def_in = await npm_def_from_user(action_choice)
		if ( !(proc_def_in) ) return
		//

		let proc_def = Object.assign({},proc_def_in)
		proc_def_in.action = ""
		proc_def_in.args = ""
		
		let action = proc_def.action
		proc_def.args = `${action} ${proc_def.args}`
		if ( proc_def ) {
			let params = {
				"admin_pass" : admin_pass,
				"op" : {
					"name" : "exec",
					"param" : {
						"proc_def" : proc_def
					}
				}
			}
			try {
				let result = await post_proc_command(params)
				if ( !result ) alert("Error")
			} catch (e) {
				alert(e.message)
			}
		}
	}


	function npm_install() {
		run_npm_command(true)
	}

	function npm_remove() {
		run_npm_command(false)
	}
	//


	function toggle_password_view() {
		password_view_type = !password_view_type
	}




	// MARKDOWN ADD ON

	let md = '# Hello world!';
	//const plugins = [gfmPlugin()];


</script>

<style>
	* {
		font-family: inherit;
		font-size: inherit;
	}

	.splash-if-you-will {
		font-size: 140%;
		text-align: center;
		line-height: 180%;
		font-weight: 700;
		color:rgb(81, 107, 131);
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	}


	.front-page-explain {
		padding: 8px;
		margin-top: 30px;
		color: orangered;
		font-size: 85%;
		font-weight: 500;
		border: solid 1px rgb(45, 99, 45);
		font-family:Georgia, 'Times New Roman', Times, serif;
	}


	input {
		display: block;
		margin: 0 0 0.5em 0;
	}

	select {
		margin: 0 1em 1em 0;
		width: 14em;
	}

	option {
		cursor: pointer;
	}


/*

	.buttons {
		clear: both;
	}

	.buttons button:disabled {
		color:slategrey;
		border-bottom-color: rgb(233, 237, 240);
		cursor:not-allowed;
	}

	.buttons button {
		background-color:rgb(255, 249, 240);
		font-size:small;
		border-bottom-color: rgb(236, 250, 226);
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
	}

	.buttons button:disabled:hover {
		background-color:inherit;
		font-size:small;
		border-bottom-color: rgb(228, 240, 247);
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
		cursor:not-allowed;
	}


	.header-button {
		max-width:min-content;
		border-radius: 6px;
		padding: 1px;
		background-color:rgb(248, 250, 248);
	}

	.header-button:hover {
		background-color:rgb(51, 65, 28);
		color:yellow;
	}

	.classy-small {
		background-color:inherit;
		font-size:small;
		border-bottom-color: chartreuse;
		border-radius: 6px;
		font-weight: 580;
		font-style: oblique;
	}


	.long_button {
		width:40%;
	}

	.long_button:disabled {
		color:beige;
	}

	.long_button:disabled:hover{
		color:beige;
		background-color:blanchedalmond;
		cursor:not-allowed;
	}

	.button-header {
		color:rgb(104, 51, 14);
	}

	.button-header:hover {
		color:rgb(15, 92, 34);
		background-color: rgba(242, 242, 210, 0.3);
	}


	.top-of-contact {
		margin-bottom: 4px;
		background-color: rgb(252, 249, 240);
		border: cornsilk solid 1px;
		text-align:right;
	}


	blockquote {
		font: 14px/22px normal helvetica, sans-serif;
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 50px;
		padding-left: 15px;
		border-left: 3px solid rgb(221, 219, 219);
  	}

	.splash-if-you-will span {
		color:rgb(27, 78, 31);
		font-weight: 900;
		font-size: 140%;
		background-color: rgb(255, 254, 238);
		padding: 12px;
		border-radius: 25px;
		font-family: 'Times New Roman', Times, serif;
	}
/*
*/

	.inner_div {
		padding-left: 2px;
		padding-top: 4px;
		border-bottom: 1px lightgray solid;
		min-height: 40px;
	}

	.inner_div label {
		font-size:smaller;
	}


	.nice_message {
		width: 85%;
		font-size: small;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		color:rgb(54, 81, 99);
		font-weight:600;
		background: -webkit-linear-gradient(to right, white ,rgb(252, 251, 248));
		background: linear-gradient(to right, white, rgb(252, 251, 248) );
	}

/*

	.add-profile-div {
		margin-top:8px;
		border: 1px solid rgb(165, 161, 190);
		padding: 2px;
		background: -webkit-linear-gradient(to right, rgb(252, 251, 240) ,rgb(249, 252, 248));
		background: linear-gradient(to right, rgb(252, 251, 240), rgb(249, 252, 248) );
	}

	.top_instructions {
		padding: 2px;
		color:rgb(66, 33, 13);
		border-bottom: sienna 1px solid;
		font: 0.9em sans-serif;
		font-weight: 600;
		font-style: oblique;
	}


	.team_message {
		background-color: rgb(254, 252, 245);
		border: solid 1px darkblue;
		padding:4px;
		color:rgb(12, 12, 100);
		font-size: 110%;
		height: calc(100vh - 280px);
		overflow: scroll;
	}

	.team_message blockquote {
		width: 85%;
		line-height: 200%;
	}

	.items {
		display: flex;
		flex-wrap: wrap;
		margin-left: 2px;
		margin-top: -10px;
	}

	.items .item {
		flex: 1 0 300px;
		box-sizing: border-box;
		background: -webkit-linear-gradient(to right, rgba(242, 242, 210, 0.3), white);
		background: linear-gradient(to right, rgba(242, 242, 210, 0.3), white );
		color: #171e42;
		padding: 10px;
		margin-left: 2px;
		margin-top: 0px;
	}

	.items {
		padding-left: 5px;
		padding-bottom: 4px;
		padding-right: 12px;
		font-size: 110%;
		font-family: sans-serif;
	}
	
	td, th {
		border : 1px solid rgb(47, 79, 49);
		border-right: none;
		padding : 2px;
		margin : 0px;
	}

	th {
		color :rgb(47, 79, 49);
		font-weight: bolder;
		background-color: seashell;
	}

	table {
		border-right: solid 1px darkslategray;
	}

	.subject {
		font-weight: bold;
	}

	.sender {
		background-color: rgb(255, 255, 255);
		font-weight: 600;
		color:rgb(27, 78, 31);
		padding-left: 4px;
	}


	.tableFixHead {
		overflow-y: auto;
		height: calc(100vh - 200px);
	}
	.tableFixHead thead th {
		position: sticky;
		top: 0;
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th, td {
		padding: 8px 16px;
		border: 1px solid #ccc;
	}
	th {
		background: #eee;
	}

	tr {
		cursor: pointer;
	}

	.tableFixHead option {
		cursor: pointer;
	}


	.user-options {
		background-color: rgb(252, 252, 249);
	}

	.user-options option {
		cursor: pointer;
	}

	.selected_form_link-display {
		margin-top:4px;
		margin-bottom:4px;
		border: solid 1px rgb(13, 48, 20);
		padding:4px;
		background-color: white;
		height:200px;
		overflow:auto;
	}

	#man_cwid {
		font-size:smaller;
		min-width:100%;
		font-weight:bold;
	}

	.signup-status {
		color: black;
		background-color: rgb(254, 252, 245);
		font-weight: bold;
		border: solid 1px rgb(13, 48, 20);
		padding:4px;
		height: 60px;
		overflow: auto;
	} 
	.good-status {
		color: green;
	}
	.bad-status {
		color: red;
	}

	.contact_form_list {
		margin-top:4px;
		margin-bottom:4px;
		border: solid 1px navy;
		padding:4px;
		color: darkgreen;
		background-color: rgb(253, 249, 242);
		text-align: center;
	}

	.signup-grid-container {
		display: grid;
		grid-column-gap: 2px;
		grid-row-gap: 2px;
		grid-template-columns: 65% auto;
		background-color: rgb(250, 250, 242);
		padding: 4px;
	}

	.signerupper {
		background-color: rgb(252, 251, 248);
		border: solid 1px rgb(0, 0, 117);
		padding:6px;
	}

	.picture-drop {
		width:90px;
		min-height:90px;
		border: 1px solid navy;
		background-color:rgb(225, 230, 236);
		display:inline-block;
		margin: 2px;
		text-align:center;
		vertical-align: middle;
		cursor:pointer;
	}

	.picture-drop:hover {
		border: 2px dotted rgb(180, 8, 31);
		background-color:rgb(151, 197, 114);
	}

	.picture-drop > .capture_image {
		position:absolute; 
		top:0px; 
		left:0px; 
		z-index:100; 
		width: auto; 
		height: inherit; 
		border:none;
		cursor:pointer;
	}

	.contact_controls {
		width: calc(32vw - 96px);
		margin: 2px;
		border: 1px solid navy;
		display:inline-block;
		background-color: white;
	}

	.contact_controls button {
		border-radius: 8px;
	}

	.manifest-grid-container {
		display: grid;
		grid-column-gap: 2px;
		grid-row-gap: 2px;
		grid-template-columns: 40% auto;
		background-color: rgb(250, 250, 242);
		padding: 4px;
	}

	.manifester {
		background-color: rgb(244, 248, 244);
		border: solid 1px darkblue;
		padding:4px;
	}

/*
*/

	.active-tab {
		color: rgb(40, 122, 19);
		background-color: rgb(255, 255, 255);
		font-weight: bolder;
	}

	.plain-tab {
		color: rgb(1, 10, 1);
	}
/*
	.manifest-contact-entry-instruct {
		font-weight: 540;
		font-style:oblique;
		padding-right:3px;
		color:tomato;
		background-color: rgba(235, 225, 235, 0.61);

	.man-default-selected {
		color:rgb(56, 156, 81);
		background-color:rgb(231, 243, 231);
		font-weight: bold;
		border: 1x solid rgb(7, 78, 7);
	}
	.man-default-not-selected {
		color:navy;
	}

	.cwid-grabber {
		font-weight:bolder;
		color:navy;
	}

	.cwid-grabber-label {
		font-weight:600;
		color:rgb(50, 148, 50);
		font-style: oblique;
	}

	.instructor {
		padding: 3px;
		margin-bottom: 4px;
	}

*/

	.dialoger {
		position : absolute;
		top : 40px;
		left: 40px;
		display : none;
		background-color: white;
		border: solid 2px darkblue;
		margin:2px;
	}


</style>

<div>
	<!--
	  Note: tabs must be unique. (They cannot === each other.)  // , "Source" ... do this later  , 'Write Doc'
	-->
	<TabBar tabs={['Overview', 'stdout', 'Ops']} let:tab bind:active>      
	  <!-- Note: the `tab` property is required! -->
	  <Tab {tab}>
		<Label><span class={ (tab === active) ? "active-tab" : "plain-tab"}>{tab}</span></Label>
	  </Tab>
	</TabBar>
	<br>

	{#if (active === 'Overview')}
	<div class="splash-if-you-will" style="height:fit-content" >
		<div class="front-page-explain">
			Overview of your processes running on instance :: {todays_date}
		</div>
		<div class="nice_message">
			<div class="inner_div">
				<button on:click={reload_all}>reload</button>
				<button on:click={add_entry}>add</button>
				<button on:click={remove_entry}>remove</button>
				&tridot;
				<button on:click={run_command}>exec</button>
				<div style="display:inline-block;text-align:left">
					{#if password_view_type }
					<label for="admin-pass">Admin Password</label><input type="password" id="admin-pass" bind:value={admin_pass} />
					{:else}
					<label for="admin-pass">Admin Password</label><input type="text" id="admin-pass" bind:value={admin_pass} />
					{/if}
				</div>
				<button  style="font-size:larger" on:click={toggle_password_view}>&#x1F441;</button>
				<div style="display:inline-block;text-align:right;width:30%">
					<button on:click={stopall}>shutdown</button>
				</div>
			</div>
			<div class="inner_div">
				<b>npm modules:</b>&nbsp;&nbsp;
				<button on:click={npm_install}>install</button>
				<button on:click={npm_remove}>uninstall</button>
			</div>
		</div>
		<div>
			<select bind:value={u_index} size={10} style="text-align:center;" on:click={navigate_to_proc} >
				{#each known_procs as maybe_proc, u_index }
					<option value={u_index} style="color:{maybe_proc.running ? 'green' : 'red' }">{maybe_proc.proc_name}</option>
				{/each}
			</select>
		</div>
	</div>
	{:else if (active === 'stdout')}
	<div class="nice_message" style="max-height: 500px;overflow:auto;border: solid 1px black">
		{@html console_output}
	</div>
  	{:else if (active === 'Ops')}
	<div class="nice_message">
		<div>
			<span style="font-size:larger">{active_proc_name}</span>
			<span style="font-size:larger;color:{running_color}">{running_state}</span>

			<div style="display:inline-block;text-align:left">
				{#if password_view_type }
				<label for="admin-pass">Admin Password</label><input type="password" id="admin-pass-2" bind:value={admin_pass} />
				{:else}
				<label for="admin-pass">Admin Password</label><input type="text" id="admin-pass-2" bind:value={admin_pass} />
				{/if}
			</div>
			<button  style="font-size:larger" on:click={toggle_password_view}>&#x1F441;</button>
		</div>
		<div class="inner_div">
			<button on:click={run_proc}>run</button>
			<button on:click={stop_proc}>stop</button>
			<button on:click={restart_proc}>restart</button>
			&tridot;
			<button on:click={update_entry}>update</button>
			<button on:click={remove_entry}>remove</button>
			<button on:click={edit_app_config}>config</button>
		</div>
		<div class="inner_div">
		<JsonView json={active_proc_data} />
		</div>
	</div>
	{:else if (active === 'Source')}
	<div>
		Look at particular files here
	</div>
	{:else if (active === 'Write Doc')}
	<div style="vertical-align:top;">
		<h1>Edit Markdown</h1>
		<table style="width:100%;">
			<tr>
				<td style="width:50%;text-align:left;vertical-align:top;">
					<textarea bind:value={md} style="width:90%" />
				</td>
				<td style="width:50%;text-align:left;vertical-align:top;">
					<Markdown {md} />
				</td>
			</tr>
		</table>
	</div>
	{/if}

</div>
<div class="dialoger nice_message" style="display:{show_dialog}">
	<MakeEntryDialog {...dialog_data} bind:admin_pass={admin_pass} message="Create a process entry" onCancel={onCancel} onOkay={onOkay} />
</div>

<div class="dialoger nice_message" style="display:{show_conf_dialog}">
	<EditConfDialog bind:conf_dialog_data={conf_dialog_data} bind:admin_pass={admin_pass} message="Edit process config file" onCancel={onConfCancel} onOkay={onConfOkay} />
</div>
	

<div class="dialoger nice_message" style="display:{show_exec_dialog}">
	<ExecDialog bind:exec_dialog_data={exec_dialog_data} bind:admin_pass={admin_pass} message="Run a single command" hasForm=true onCancel={onExecCancel} onOkay={onExecOkay} />
</div>
	

<div class="dialoger nice_message" style="display:{show_npm_dialog}">
	<NpmDialog bind:npm_dialog_data={npm_dialog_data} bind:admin_pass={admin_pass} message="Mnage Npm modules"  npm_action={npm_action} hasForm=true onCancel={onNpmCancel} onOkay={onNpmOkay} />
</div>


<div class="dialoger nice_message" style="display:{show_update_dialog}">
	<MakeEntryDialog {...dialog_update_data} bind:admin_pass={admin_pass} message="Update this process entry" onCancel={onUpdateCancel} onOkay={onUpdateOkay} />
</div>
