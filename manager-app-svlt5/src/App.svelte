
<script>

import LoginBox from "./lib/LoginBox.svelte"
import URLBox from "./lib/URLBox.svelte"
import HostListCtrl from "./lib/HostListCtrl.svelte"
import PluginPanel from "./lib/PluginPanel.svelte";
let g_admin_pass = $state("testit");
let g_manual_url = $state("localhost");

let g_active_url  = $state("");
let g_active_addr = $state("");
let g_plugin_name = $state("")


let g_panel = $state("host-list");

let g_panel_selections = [
  "host-list",
  "host-stats",
  "host-ops",
  "host-procs",
  "host-edit",
  "host-cmd-line",
  "host-top",
  "host-plugins",
  "host-cloud"
]

let g_panels = {
  "host-list" : "Admin and Target",
  "host-stats" : "Statistic",
  "host-ops" : "Operations",
  "host-procs" : "Procedures",
  "host-edit" : "Editor",
  "host-cmd-line" : "command line",
  "host-top" : "HTOP",
  "host-plugins" : "plugins",
  "host-cloud" : "service"
}


let g_panel_menu = {
  "host-list" : "hosts",
  "host-stats" : "statistics",
  "host-ops" : "operations",
  "host-procs" : "prodedures",
  "host-edit" : "editor",
  "host-cmd-line" : "commands",
  "host-top" : "htop",
  "host-plugins"  : "plugins",
  "host-cloud" : "service"
}


let g_panels_displayed = {
  "host-list" : "block",
  "host-stats" : "none",
  "host-ops" : "none",
  "host-procs" : "none",
  "host-edit" : "none",
  "host-cmd-line" : "none",
  "host-top" : "none",
  "host-plugins" : "none",
  "host-cloud" : "none"
}

function update_panels(panel) {
  for ( let p in g_panels_displayed ) {
    if ( p === panel ) {
      g_panels_displayed[p] = "block"
    } else {
      g_panels_displayed[p] = "none"
    }
  }
}

</script>

<div class="top-controls " >
  <div class="ui-controls-1 dropdown">
    <div class="admin-hover dropdown">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path class="heroicon-ui" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
      </svg>      
    </div>
    <div class="dropdown-content" >
      <div class="selected-panel">
        {g_panels[g_panel]}
      </div>
      <ol>
        {#each g_panel_selections as a_panel }
          <li >
            <button onclick={(ev) => { g_panel = a_panel; update_panels(a_panel) }} >{g_panel_menu[a_panel]}</button>
          </li>
        {/each}
      </ol>
    </div>
  </div>

  <div class="ui-controls-1 dropdown">
    <div class="admin-hover dropdown">Admin and Target</div>
    <div class="dropdown-content" >
        <LoginBox bind:admin_pass={g_admin_pass} />
        <URLBox bind:manual_url={g_manual_url} />
    </div>
  </div>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <rect width="30" height="30" x="3" y="5" rx="2" ry="2" fill="rgba(250,235,215,0.4)" />
    </svg>
      {#if g_panel == 'host-list'}
        <span style="margin-bottom:4px;">Running admin from: {g_manual_url}</span>
      {:else}
        {#each g_panel_selections as a_panel }
          {#if (g_panel == a_panel) }
            <span>{g_panels[a_panel]}</span> <span>{g_active_addr}</span> <span>{g_active_url}</span>
          {/if}
        {/each}
      {/if}
    </div>  
</div>


<div style="display:{g_panels_displayed['host-list']}" >

  <HostListCtrl bind:active_url={g_active_url} bind:active_addr={g_active_addr}  _admin_pass={g_admin_pass} _manual_url={g_manual_url} />

</div>
<div style="display:{g_panels_displayed['host-stats']}" >
  Statistics 
</div>
<div style="display:{g_panels_displayed['host-ops']}" >
  Operations
</div>
<div style="display:{g_panels_displayed['host-procs']}" >
  Running processes
</div>
<div style="display:{g_panels_displayed['host-edit']}" >
  Editor
</div>
<div style="display:{g_panels_displayed['host-cmd-line']}" >     
  <iframe class="terminal" title="terminal-frame" src="http://localhost:8080">

  </iframe>
</div>
<div style="display:{g_panels_displayed['host-top']}" >
  Htop 
</div>
<div style="display:{g_panels_displayed['host-plugins']}" >
  <PluginPanel bind:active_plugin={g_plugin_name} _admin_pass={g_admin_pass} _manual_url={g_manual_url} />
</div>
<div style="display:{g_panels_displayed['host-cloud']}" >
  <ul>
    <li>
        <a href="https://my.vultr.com" target="_blank"> vultr EKVL8DL@7VkxXmi</a>
    </li>
    <li>
      name cheap
    </li>
    <li>
      go daddy
    </li>
    <li>
      github
    </li>
    <li>
      npm
    </li>
  </ul>
</div>


<style>

  li {
    cursor: pointer;
    font-weight: bold;
  }

  li:hover {
    color: darkolivegreen;
    text-decoration: underline;
    background-color: antiquewhite;
    border-bottom: solid darkgreen 1px;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 200px;
    height:max-content;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 1;
  }

  .dropdown:hover .dropdown-content {
    display: block;
    width: fit-content;
    height: fit-content;
  }

  span {
    margin-left: 3px;
    margin-right: 3px;
    font-weight: bold;
    font-size: 0.88em;
  }

  .ui-controls-1 {
    width: fit-content;
    vertical-align: top;
    display: inline-block;
  }

  .top-controls {
    width:100%;
    height: 60px;
    text-align: left;
    vertical-align: text-top;
    border-bottom: 1px solid darkslateblue;
  }

  .admin-hover {
    box-shadow: 2px 3px rgb(248, 230, 185);
    font-weight: bolder;
    box-shadow: gainsboro;
    text-decoration-line: underline;
    cursor: pointer;
  }

  .admin-hover:hover {
    cursor: pointer;
    background-color: rgba(176, 166, 143,0.2);;
    box-shadow: 3px 1px rgb(176, 166, 143);
    text-shadow: 1px 2px 0px #12100b;
    color: rgb(240, 208, 126);
  }


  .selected-panel {
    border-bottom: 1px solid rgb(5, 44, 5);
  }


  .terminal {
    width: 100%;
    height: calc(100vh - 180px)
  }
  
</style>
