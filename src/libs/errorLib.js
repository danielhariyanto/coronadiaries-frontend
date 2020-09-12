import { message as antdMessage} from 'antd';

export function onError(error) {
    let message = error.toString();

    // Auth errors
    if (!(error instanceof Error) && error.message) {
        message = error.message;
    }

    antdMessage.error(message);
}