/*global define*/
define(['./defined'], function(defined) {
    "use strict";

    /**
     * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
     * out of memory, could not compile shader, etc.  If a function may throw this
     * exception, the calling code should be prepared to catch it.
     * <br /><br />
     * On the other hand, a {@link DeveloperError} indicates an exception due
     * to a developer error, e.g., invalid argument, that usually indicates a bug in the
     * calling code.
     *
     * @alias RuntimeError
     *
     * @param {String} [message=undefined] The error message for this exception.
     *
     * @see DeveloperError
     * @constructor
     */
    var RuntimeError = function(message) {
        /**
         * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
         * @type {String}
         * @constant
         * @default
         */
        this.name = 'RuntimeError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @constant
         */
        this.message = message;

        //Browsers such as IE don't have a stack property until you actually throw the error.
        var stack;
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @constant
         */
        this.stack = stack;
    };

    RuntimeError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return RuntimeError;
});