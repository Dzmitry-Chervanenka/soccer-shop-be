import {parseBasicAuthHeader} from "@functions/basicAuthorizer/parseBasicAuthHeader";
import {generateAuthPolicy} from "@functions/basicAuthorizer/generateAuthPolicy";
export const basicAuthorizer = async (event) => {
  console.log('Authorization in progress')
  console.log(event)
  try {
    let effect = 'Deny';
    const user = parseBasicAuthHeader(event.authorizationToken)
    console.log(user)
    if (
        user &&
        user.username === "DzmitryChervanenka" &&
        user.password === process.env["DzmitryChervanenka"]
    ) {
      effect = 'Allow';
    }
    return generateAuthPolicy('user', effect, event.methodArn)
  } catch (e) {
    console.error('Authorizing request failed %s', e);
  }

};