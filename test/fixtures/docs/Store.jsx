import rxmq from 'ecc-messagebus';
const Channel = rxmq.channel('gulp');

/**
 * This is a privat function.
 * @param replySubject {object} - i have no name
 * @param boz {string} - boz example
 * @returns {string} - current endpoint string
 * @returns {array} - current endpoint array
 * @privateSubject ChannelName - config.get
 */
const handleConfigRequest = ({replySubject, boz}) => {
    replySubject.onNext(storedAuth['DEFAULT_CONTEXT']);
    replySubject.onCompleted();
};

/**
 * This is a public function.
 * @publicSubject ChannelName - config.get
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
 * @param data {object} - example
 * @param data.name {string|array} - string example
 * @param data.order {array} - array example
 * @returns current endpoint config
 * @privateSubject ChannelName - config.get
 */
const furtherPrivateFunction = (data) => {
    return data;
};

/**
 * This is a privat function.
 * @param bar {object} - example
 * @returns current endpoint config
 */
const shouldNotInDocu = ({replySubject}) => {
    replySubject.onNext(storedAuth['DEFAULT_CONTEXT']);
    replySubject.onCompleted();
};
// listen for config get event
Channel.subject('config.get').subscribe(handleConfigRequest);
// .... more subscribes


export default Channel;
