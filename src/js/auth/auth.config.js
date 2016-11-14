function AuthConfig($stateProvider, $httpProvider) {
  'ngInject';

  // Define the routes
  $stateProvider
  .state('app.login', {
    url: '/login',
    controller: 'AuthController as $ctrl',
    templateUrl: 'auth/auth.html',
    title: 'Login',
    resolve: {
      auth: function(User) {
        return User.ensureAuthIs(false);
      }
    }
  });
}

export default AuthConfig;