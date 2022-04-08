# Feature flags API

*by Hugo DERIGNY <hugo.derigny@gmail.com>*

> Everything is free since it's a self-hosted API.

> If you are planning to use this API with a react front end, check the hook i made that use this API : [react-use-feature-flags-api]()

**Summary**

- [How to use ?](#how-to-use-)
- [Setup](#setup)
- [API Reference](#api-references)

## How to use ?

First, you need to add a service, it can be anything. You'll use this service to fetch flags.

Then, you need to add a flag with different parameters :

- A **key** that you will use this key to tell if the flag is on/off.
- An eventual **value** that you will be able to use in your app.

Finally, you can enable the flag globally and enable them by browsers.

Current list of support browsers : **Safari, Chrome/Chromium, Firefox, Edge, IE, Opera**.

**/!\ IMPORTANT NOTE**

By default, the API use the User-Agent header to tell if the flag is enable or disable.

You can specify yourself the browser used, chec the [api references](#api-references) to see how.

## Setup

1. Start by cloning this repository

```shell
git clone https://github.com/HugoDerigny/feature-flags-api.git
```

2. Install dependencies in both **api** and **front** folders.

```shell
cd ./api
npm i

cd ../front
npm i
```

3. Specify environnements variables

For the **API** you'll need these variables :

```dotenv
# in /api/.env
DB_PATH=/db/feature_flags.db
PORT=3001
AUTHORIZATION=ABCDEFGH
```

| Key             | Description                                                                                                                                                                                    | Default value           | Required |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------|
| `DB_PATH`       | The relative or absolute path to your **SQLite Database**. To persist data you can specify an external directory.<br/> If you are using ** Docker**, you can specify a volume (see here #todo) | `./db/feature_flags.db` | ✅        |
| `PORT`          | The port used by our API to run.                                                                                                                                                               | `3001`                  | ❌        |
| `AUTHORIZATION` | A key to verify requests.                                                                                                                                                                      | ``                      | ✅        |

For the **front** you'll need these variables :

```dotenv
# in /front/.env
PORT=3000
REACT_APP_API_URL=http://localhost:4001
REACT_APP_API_AUTHORIZATION=ABCDEGH
```

| Key                           | Description                                    | Default value           | Required |
|-------------------------------|------------------------------------------------|-------------------------|----------|
| `PORT`                        | The port used by our app to run.               | `3000`                  | ❌        |
| `REACT_APP_API_URL`           | The URL that the API is using.                 | `http://localhost:4001` | ✅        |
| `REACT_APP_API_AUTHORIZATION` | Key provided by the API to allow the requests. | ``                      | ✅        |

4. Start apps

```shell
npm run dev-api
npm run dev-front
```

## API references

> All HTTP requests must provides the `Authorization` header, specified in the **.env**.
> If it's not provided, api will respond by a **401 Unauthorized**.

- [Fetch all services](#get-services)
- [Create a service](#post-services)
- [Update a service name](#put-servicesuid)
- [Delete a service](#delete-servicesuid)
- [Get flags for a service](#get-servicesuidflags)

### Services

#### GET `/services`

Fetch all services.

*Response*

✅ 200 OK

```json5
[
  {
    "id": "8df81e22-e606-459d-b3b1-9ef2a2dc029a",
    "name": "my-service",
    "createdAt": "2022-03-20T01:45:42.047Z",
    "updatedAt": "2022-03-20T01:45:42.047Z",
    "flags": [
      {
        "id": 1,
        "serviceId": "8df81e22-e606-459d-b3b1-9ef2a2dc029a",
        "createdAt": "2022-03-20T01:46:03.599Z",
        "updatedAt": "2022-03-20T01:46:03.599Z",
        "key": "my-flag",
        "value": "flag value !!",
        "summary": "quick explanation of the flag...",
        "enabled": true,
        "enabledForOpera": false,
        "enabledForFirefox": true,
        "enabledForSafari": true,
        "enabledForIE": false,
        "enabledForEdge": false,
        "enabledForChrome": true
      },
      // other flags...
    ]
  },
  // other services...
]
```

#### POST `/services`

Create a new service with no flags yet.

*Body*

```json5
{
  "name": "my-service" // any string
}
```

*Response*

❌ 400 Bad request

✅ 201 Created

```json5
{
  "id": "367f543a-66be-46f3-b8ca-210a392f77a5",
  "name": "my-service",
  "updatedAt": "2022-03-20T01:30:57.218Z",
  "createdAt": "2022-03-20T01:30:57.218Z"
}
```

#### PUT `/services/:uid`

Update a service name

*Param*

- `uid` : service uid.

*Body*

```json5
{
  "name": "my-service-updated" // any string
}
```

*Response*

❌ 400 Bad request

❌ 404 Not found *if service uid is wrong*

✅ 204 No content

#### DELETE `/services/:uid`

Delete a service if it has no flags.

*Param*

- `uid` : service uid.

*Response*

❌ 400 Bad request

❌ 404 Not found *if service uid is wrong*

✅ 204 No content


#### GET `/services/:uid/flags`

Fetch all flags for a service.

*Param*

- `uid` : service uid.

*Response*

```json5

```

### Flags