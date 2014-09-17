( function(){

    var util = require('util');
    var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
    var InternalOAuthError = require('passport-oauth').InternalOAuthError;
    var slackHost = "https://slack.com/";

    function SlackStrategy( options, verify ){
        options = options || {};
        options.scope = options.scope || [ "identify", "read", "post"];
        options.slackTeam = options.slackTeam || "";
        options.tokenURL = options.tokenURL || slackHost + "api/oauth.access";
        options.authorizationURL = options.authorizationURL || slackHost + "/oauth/authorize";
        options.scopeSeparator = ",";

        this.slackTeam = options.slackTeam;

        OAuth2Strategy.call( this, options, verify );
    }
    util.inherits( SlackStrategy, OAuth2Strategy );


    SlackStrategy.prototype.authorizationParams = function( options ){
        var self = this;
        return {
            team: options.slackTeam || self.slackTeam
        };
    };

    SlackStrategy.prototype.userProfile = function( accessToken, done ){
        var self = this;

        /* Hope Jared never removes this because Slack requires the token be named 'token'. */
        self._oauth2.setAccessTokenName("token");

        self._oauth2.get( slackHost + "/api/auth.test", accessToken, function( error, body, response ){
            if( error ){ return done( new InternalOAuthError( 'Failed to identify user: ', error ) ); }

            try {
                var json = JSON.parse( body );

                if( json.ok !== true ){
                    return done( new InternalOAuthError( 'Failed to identify user: ', json ) );
                }

                var profile = { provider: 'slack' };
                profile.id = json.user_id;
                profile.username = json.user;
                profile.teamId = json.team_id;
                profile.team = json.team;
                profile.slackUrl = json.url;
                profile._raw = body;
                profile._json = json;

                done( null, profile );
            } catch( e ){
                done( e );
            }
        });
    }

    module.exports = SlackStrategy;

})();
