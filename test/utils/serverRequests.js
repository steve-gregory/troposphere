define(function(require) {
  "use strict";

  return function(server, requestType){
    switch(requestType) {
      case "paginatedList":
        server.respondWith(
          "GET",
          "/api/tests",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
                count: 4,
                next: "/api/tests?page=2",
                previous: null,
                results: [
                  {"id": 1, "name": "hello"},
                  {"id": 2, "name": "world"}
                ]
              })
          ]);

        server.respondWith(
          "GET",
          "/api/tests?page=2",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
                count: 4,
                next: null,
                previous: "/api/tests",
                results: [
                  {"id": 3, "name": "foo"},
                  {"id": 4, "name": "bar"}
                ]
              })
          ]);

        break;


      case "completeList":
        server.respondWith(
          "GET",
          "/api/tests",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
                count: 2,
                next: null,
                previous: null,
                results: [
                  {"id": 1, "name": "hello"},
                  {"id": 2, "name": "world"}
                ]
              })
          ]);
        break;

      case "singleModel":
        server.respondWith(
          "GET",
          "api/tests/2",
          [
            200, {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              "id": 2, "name": "world"
            })
          ]);
        break;
    }
  }

});
