<script>

let { manual_url = $bindable("localhost:8999"), ...props } = $props();


let manual_port = $state("8999")
let manual_host = $state("localhost")

function update_manual_url(event) {
  if ( manual_port.length > 0 ) {
    manual_url = `${manual_host}:${manual_port}`
  } else {
     manual_url = `${manual_host}`
  }
}

update_manual_url()

</script>

<div class="nice_message">
  <div class="inner_div">
    <div style="display:inline-block;text-align:left">
      Target;&nbsp;&tridot;&nbsp;
      <label for="manual-url">URL:</label> &nbsp;<input type="text" id="manual-url" onchange={update_manual_url} bind:value={manual_host} {...props}  />
      <br>
      <label for="manual-port">Port:</label> &nbsp;<input type="text" id="manual-port" onchange={update_manual_url} bind:value={manual_port} {...props}  />
    </div>
  </div>
</div>

<style>

	.inner_div {
		padding-left: 2px;
		border-bottom: 1px lightgray solid;
    height: fit-content;
    vertical-align: top;
	}

	.inner_div label {
		font-size:smaller;
	}

	.nice_message {
    display: inline-block;
    vertical-align: top;
    height: fit-content;
		width: fit-content;
    max-height: fit-content;
    padding-left: 2px;
    padding-right: 2px;
		font-size: small;
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		color:rgb(54, 81, 99);
		font-weight:600;
		background: -webkit-linear-gradient(to right, white ,rgb(252, 251, 248));
		background: linear-gradient(to right, white, rgb(252, 251, 248) );
	}

  button {
    padding: 4px;
    width: fit-content;
    height: fit-content;
    border-radius: 35%;
  }

</style>
