(function() {
    angular
        .module('linked-learning')
        .controller('ListingController', ListingController);

    function ListingController(BookmarkFactory, UserFactory, $route, $timeout) {

        var vm = this;
        vm.title = "Bookmark Controller Outside";
        vm.urlRegEx = /(http(s)?:\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/;
        vm.bookmarks = [];
        vm.newComment = {};
        vm.newBookmark = {};
        
        vm.search = "";
        vm.order = 'ascending';
        vm.prefix = "";
        vm.sort = "title";
        vm.sortMessage = "Sort By";

        vm.setSort = setSort;
        vm.setOrder = setOrder;        

        vm.deleteBookmark = deleteBookmark;
        vm.loadComments = loadComments;
        vm.reload = reload;
        vm.getBookmarks = getBookmarks;
        vm.addBookmark = addBookmark;

        vm.getBookmarks();
                        
        function setSort(sortBy) {
            console.log('sorting');
            vm.sort = sortBy;
            vm.sortMessage = sortBy;
        }

        function setOrder() {
            console.log('ordering');
            if (vm.order == 'descending')
                vm.prefix = "";
            else
                vm.prefix = "-";
        }

        function reload() {
            return $route.reload();
        }


        function getBookmarks() {
            BookmarkFactory.getBookmarks()
                .success(function(data) {
                    vm.bookmarks = data;
                });
        }

        function addBookmark(bookmark) {
            bookmark.url = bookmark.url.replace('https://', '');
            bookmark.url = bookmark.url.replace('http://', '');
            bookmark.user = UserFactory.name;

            BookmarkFactory.addBookmark(bookmark)
                .success(function() {
                    vm.bookmarks.push(bookmark);
                });
            vm.newBookmark = {};
            $timeout(vm.reload, 200);
        }

        function deleteBookmark(index) {
            console.log("Removing bookmark at " + index);
            vm.bookmarks.splice(index, 1);
        }

        function loadComments(index, layoutController) {
            if (typeof vm.bookmarks[index].comments === "undefined") {
                vm.bookmarks[index].comments = [];
            }

            BookmarkFactory.curIndex = index;
            layoutController.pageRight = 'comments';
        }
    }
})();