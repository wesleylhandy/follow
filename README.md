# URL Shortener Microservice for FCC

Go to the following url: https://follow.glitch.me/

By adding parameters to the URL string, the API will return a shortened URL for that parameter, assuming it is passed a valid URI string.

Once a shortened URL is created, you can then use that url anywhere to be redirected to the original url string.

Creating a new shortened url is on the `/new` endpoint.

### Examples

* `https://follow.glitch.me/new/http://helloenjoy.com/project/lights`

:dizzy: *Returns* :dizzy:

```javascript 
  {
    "original_url": "http://helloenjoy.com/project/lights",
    "short_url": "https://follow.glitch.me/HJd8hPMDW"
  }
```

Try clicking here to see the shortened url in action: https://follow.glitch.me/HJd8hPMDW