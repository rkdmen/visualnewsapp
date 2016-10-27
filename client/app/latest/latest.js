angular.module('legacyOwls.latest', [])
.controller('latest', ['$scope', 'Articles', 'Trending', 'SavedArticles', function($scope, Articles, Trending, SavedArticles) {

  $scope.options = Articles.options;
  $scope.selectedOption = 'all';

  $scope.getLatest = function() {
    var params = {
      source: 'all',
      section: $scope.selectedOption,
      time: '24',
      limit: 40,
      offset: 0
    }

    Trending.getAll()
    .then(function(res){

      $scope.urls = {};
      console.log('Inside line 20 ', res.data);
      res.data.forEach(function(article) {
        $scope.urls[article.articleData.url] = article.numberLikes;
      });

      console.log($scope.urls);

      $scope.likes = {};

      SavedArticles.getLikesFromDB()
      .then(function(response) {
        response.forEach(function(article) {
          $scope.likes[article.url] = true;
        });
      });

      console.log($scope.likes);

      $scope.saved = {};

      SavedArticles.getArticlesFromDB()
      .then(function(response) {
        response.forEach(function(article) {
          $scope.saved[article.url] = true;
        });
      })

      Articles.getLatest(params)
      .then(function(response) {
        // photos is an array that is set to the results array received from API
        $scope.photos = response.data.results.filter(function(photo) {
          // only want the articles that have a photo url - some of them have multimedia = ''
          
          photo.likes = $scope.urls[photo.url] ? $scope.urls[photo.url] : 0;
          return photo.multimedia.length === 4 && photo.item_type !== 'Slideshow';
        });

      });

    });

  }

  // Get the latest news items
  $scope.getLatest();

  // Save the news item
  $scope.saveStory = function(index) {
    var article = $scope.photos[index];
    SavedArticles.saveArticleToDB(article)
    .then(function(response) {
      console.log("Success");
      $scope.saved[article.url] = true;
    })
    .catch(function(err) {
      console.error(err);
    });
  }

  // Like the news item
  $scope.like = function(index) {
    var article = $scope.photos[index];

    Trending.like(article)
    .then(function(response) {
      console.log("Success");
      $scope.photos[index].likes++;
    })
    .catch(function(err) {
      console.error(err);
    });

    SavedArticles.saveLikeToDB(article)
    .then(function(response) {
      console.log("Success");
      $scope.likes[article.url] = true;
    })
    .catch(function(err) {
      console.error(err);
    });

  }

  // Look for newest news every 5 minutes
  setInterval($scope.getLatest, 5*60000); 

}]);
