<template>
    <div class="integrations">
        <div v-if="userToken">
        <!-- Dropbox -->
        <div class="row integration">
            <div v-if="userToken.dropboxAccountId">
                <div class="panel panel-success">
                    <div class="panel-heading">Icarus is monitoring your Dropbox activity</div>
                    <div class="panel-body">Icarus logs your actions (e.g. file created/modified) and the time it happened,
                        but no file name or content.
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="panel panel-default">
                    <div class="panel-heading"><button v-on:click="dropboxLogin()" class="btn btn-lg btn-primary">Link Dropbox account</button></div>
                    <div class="panel-body">Icarus will only log your action (e.g. file created/modified) and the time it happened,
                            but no file name or content.            
                    </div>
                </div>
            </div>        
        </div>

        <!-- Github -->
        <div v-if="userToken.githubUsername">
            <div class="panel panel-success">
                <div class="panel-heading">Icarus is monitoring your Github activity</div>
                <div class="panel-body">Icarus only logs your actions (e.g. open an Issue) and the time it happened, but no ID, content or text.<br/>
                    Only Organisations and Repositories configured to notify events to Icarus are monitored.
                </div>
                </div>
        </div>
        <div v-else>
            <div class="panel panel-default">
                <div class="panel-heading"><button v-on:click="githubLogin()" class="btn btn-lg btn-primary">Link Github account</button></div>
                <div class="panel-body">Icarus will only log your actions (e.g. open an Issue) and the time it happened, but ID, content or text.<br/>
                    Only Organisations and Repositories configured to notify events to Icarus are monitored.
                </div>
            </div>              
        </div>      
        </div>  
        <!-- Slack login --> 
        <div v-else class="row slack-login">
            <div class="panel panel-default">
                <div class="panel-heading"><button v-on:click="slackLogin()" class="btn btn-lg btn-primary">Login / Sign in with Slack</button></div>
                <div class="panel-body">Icarus only accesses your user basic info (name, user ID, team ID).<br/>
                    The Slack user is your main identity in Icarus.
                </div>
            </div>  
        </div>          
    </div>
</template>

<script>


export default {
  name: 'integrations',
  props: [ 'siteBasePath', 'lambdaPath' ],
  computed: {
      userToken: function() {
        return getUserToken()
      },
  },  
  mounted: function() {
      console.log('Integrations: lambda: ' + this.lambdaPath)
      console.log('Integrations: site: ' + this.siteBasePath)
  },
  methods: {
    slackLogin: function() {
      var returnPageUri = this.siteBasePath + '/#/post-login';
      var authInitiateUri = this.lambdaPath + '/slack-oauth-initiate?returnUri=' + returnPageUri;
      console.log('Initiating Slack login via: ' + authInitiateUri)
      window.location.href = authInitiateUri;      
    },
    dropboxLogin: function() {
      var icarusAccessToken = this.$data.userToken.accessToken;
      var returnPageUri = this.siteBasePath + '/#/dropbox-post-login';
      var authInitiateUri = this.lambdaPath + '/dropbox-oauth-initiate';
      postForm(this.ambdaPath + '/dropbox-oauth-initiate', {
        icarusAccessToken: icarusAccessToken,
        returnUri: returnPageUri,
      })
    },
    githubLogin: function() {
      var icarusAccessToken = this.$data.userToken.accessToken;
      var returnPageUri = this.siteBasePath + '/#/github-post-login';
      postForm(this.ambdaPath + '/github-oauth-initiate', {
        icarusAccessToken: icarusAccessToken,
        returnUri: returnPageUri,        
      })
    },
    
  }
}


function getUserToken() {
  const userToken = Vue.ls.get("user_token")
  console.log('Retrieving user token:', JSON.stringify(userToken))  
  return userToken
}



function removeUserToken() {
  Vue.ls.remove("user_token")
}

// Simple utility to POST data as a form
// based on https://www.npmjs.com/package/submitform
// Seriously, this is the clean way to post an object as a form?
function postForm(url, data) {
	if (typeof data !== 'object') {
		throw new TypeError('Expected an object');
	}
  var form = document.createElement('form');
  form['action'] = url
  form['method'] = 'POST'
	form.style.display = 'none';
	form.appendChild(getInputs(data));

	document.body.appendChild(form);
	form.submit();
}

function getInputs(data) {
	var div = document.createElement('div');

	for (var el in data) {
		if (data.hasOwnProperty(el)) {
			var input = document.createElement('input');
			input.name = el;
			input.value = data[el];
			div.appendChild(input);
		}
	}
	return div;
}
</script>

<style scoped>
.slack-login,
.logout,
.integration{
  padding-right: 10px;
  padding-left: 10px;
}

</style>
