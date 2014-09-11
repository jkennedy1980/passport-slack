# passport-slack

[Passport](http://passportjs.org/) strategy for authenticating with [Slack](https://slack.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Slack in your Node.js applications.
By plugging into Passport, Slack authentication can be easily integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-slack

## Usage

#### Configure Strategy

The Slack authentication strategy authenticates users using a Slack account
and OAuth tokens.  The strategy requires a `verify` callback, which receives the
access token and corresponding secret as arguments, as well as `user` which
contains the authenticated user's slack info. The `verify` callback must
call `done` providing a user to complete authentication.

In order to identify your application to Slack, specify the clientID,
clientSecret, and redirect URL within `options`.  The client ID and secret
are obtained by [creating an application](https://api.slack.com/applications) at
Slacks's [api](https://api.slack.com/applications) site.

    var SlackStrategy = require('./passport-slack').SlackStrategy;
    passport.use( 'slack', new SlackStrategy({
        clientID: "2579862865.2611629190",
        clientSecret:"c8f79343db3e4b3a28fde613ae5a0d93",
        callbackURL: "http://localhost:3000/authenticate/callback",
        slackTeam: "[slack team id]"
    }, function( token, tokenSecret, profile, done ){
        var User = neoteric.model('User');
        User.findBySlackId( profile.id, function( error, existingUser ){
            if( error ) return done( error, false );

            if( existingUser ){
                done( error, existingUser );
            }else{
                var newUser = new User();
                newUser.username = parsedBody.user;
                newUser.slackId = slackId;
                newUser.save( function( error, newUser ){
                    done( error, newUser );
                });
            }
        });
    }));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'slack'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/slack',
      passport.authenticate('slack'));

    app.get('/auth/slack/callback',
      passport.authenticate('slack', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

  - [Josh Kennedy](http://github.com/jkennedy1980)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Josh Kennedy <[http://ponycode.com/](http://ponycode.com/)>