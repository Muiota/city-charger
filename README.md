# city-charger
City charger project for Baltic Sea Hack


### TODO

- [ ] Simple authorization to index and api (signin/signup/logout)
- [ ] Pages template
- [ ] Main page with current status
- [ ] Status rest api
- [ ] Send package page
- [ ] Send package rest api
- [ ] Package card
- [ ] Courier page
- [ ] Simple list of packages for courier
- [ ] Map route for courier
- [ ] Get package rest api
- [ ] Balances
- [ ] Users
- [ ] Packages
- [ ] Recycler page 
- [ ] Handshake algorythm
- [ ] Toasts
- [ ] Settings page



Build and deploy the application from the command line using the `oc` command line tool, and a nodejs builder image:

    oc new-app openshift/nodejs~https://github.com/Muiota/city-charger

After your deployment has completed, find the pod NAME for your hosted container:

    oc get pods

Push changes from a local repo into this environment using the pod NAME from the previous step, allowing you to test your changes without stopping to make a commit:

    oc rsync --exclude='node_modules*' . YOUR_PODNAME:

Use gulp to automatically publish updates your remotely-hosted container as you work:

    PODNAME=YOUR_PODNAME gulp

The included [`gulpfile`](https://github.com/Muiota/city-charger/blob/master/gulpfile.js) example will automatically distribute changes from your local `index.html` file into the identified pod.

# Local Development
Install dependencies:

```bash
npm install
```

Start a local server:

```bash
npm start
