import rxmq from 'ecc-messagebus';
const Channel = rxmq.channel('gulp');

/**
 * This is a privat function.
 * @param {object} - i have no name
 * @param boz {string} - boz example
 * @returns {string} - current endpoint config
 * @privatChannel
 */
const handleConfigRequest = ({replySubject, boz}) => {
    replySubject.onNext(storedAuth['DEFAULT_CONTEXT']);
    replySubject.onCompleted();
};

/**
 * This is a public function.
 * @param {string} - example
 * @returns the same
 * @publicChannel
 */
const publicFunction = (foo) => {
    return foo;
};

/**
 * Handler which should not be shown
 * @param {object} - example
 * @returns current endpoint config
 */

/**
 * This is a privat function.
 * @param bar {string} - example
 * @returns current endpoint config
 * @privatChannel
 */
const furtherPrivateFunction = (bar) => {
    return bar;
};

const shouldNotInDocu = ({replySubject}) => {
    replySubject.onNext(storedAuth['DEFAULT_CONTEXT']);
    replySubject.onCompleted();
};
// listen for config get event
Channel.subject('config.get').subscribe(handleConfigRequest);
// .... more subscribes


export default Channel;


/*
namespath:
{
  "module": [],
  "class": [],
  "constructor": [],
  "mixin": [],
  "member": [],
  "namespace": [],
  "constant": [],
  "function": [
    "handleConfigRequest"
  ],
  "event": [],
  "typedef": [],
  "external": []
}

 */


/*
command: "docsTest": "jsdoc2md test/fixtures/docs/Store.jsx > .tmp/Store.md"
 */

/*
[
  {
    "id": "handleConfigRequest",
    "longname": "handleConfigRequest",
    "name": "handleConfigRequest",
    "kind": "function",
    "scope": "global",
    "params": [
      {
        "type": {
          "names": [
            "object"
          ]
        },
        "description": "example"
      }
    ],
    "returns": [
      {
        "description": "current endpoint config"
      }
    ],
    "customTags": [
      {
        "tag": "privat",
        "value": "This is a privat function."
      }
    ],
    "meta": {
      "lineno": 10,
      "filename": "Store.jsx",
      "path": "/Users/kayvollers/Workspace/comps/ecc-gulp-tasks/test/fixtures/docs"
    },
    "order": 0
  },
  {
    "id": "publicFunction",
    "longname": "publicFunction",
    "name": "publicFunction",
    "kind": "function",
    "scope": "global",
    "params": [
      {
        "type": {
          "names": [
            "string"
          ]
        },
        "description": "example"
      }
    ],
    "returns": [
      {
        "description": "the same"
      }
    ],
    "access": "public",
    "meta": {
      "lineno": 21,
      "filename": "Store.jsx",
      "path": "/Users/kayvollers/Workspace/comps/ecc-gulp-tasks/test/fixtures/docs"
    },
    "order": 1
  },
  {
    "id": "shouldNotInDocu",
    "longname": "shouldNotInDocu",
    "name": "shouldNotInDocu",
    "kind": "function",
    "scope": "global",
    "description": "Handler which should not be shown",
    "params": [
      {
        "type": {
          "names": [
            "object"
          ]
        },
        "description": "example"
      }
    ],
    "returns": [
      {
        "description": "current endpoint config"
      }
    ],
    "meta": {
      "lineno": 30,
      "filename": "Store.jsx",
      "path": "/Users/kayvollers/Workspace/comps/ecc-gulp-tasks/test/fixtures/docs"
    },
    "order": 2
  }
]
 */
