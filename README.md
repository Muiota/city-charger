# city-charger
City charger project for Baltic Sea Hack

#### demo
http://demo-balticsea.apps.us-east-1.starter.openshift-online.com/

### TODO

- [x] Design prototype  [09.11.2019 11:00]
- [x] Landing product page  [09.11.2019 16:00]
- [x] Simple authorization to index and api (signin/signup/logout) [09.11.2019 19:00]
- [x] Pages template [09.11.2019 21:00]
- [x] Localization [10.11.2019 0:00]
- [ ] Main page with current status
- [x] Status rest api
- [x] Send package page [10.11.2019 1:30]
- [x] Send package rest api [10.11.2019 3:00]
- [ ] Package card
- [x] Courier page   [10.11.2019 13:00]
- [x] Simple list of packages for courier  [10.11.2019 14:00]
- [x] Map route for courier  [10.11.2019 10:00]
- [x] Get package rest api
- [ ] Balances
- [ ] Users
- [ ] Packages
- [ ] Recycler page 
- [ ] Handshake algorithm (QR code/ sms/push)
- [x] Toasts
- [ ] Settings page / adresses



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
