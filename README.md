# santa
Deploying to the cloud with your flying sleigh.

## Installation

```bash
npm -g install santa
```

## Usage

### Configuration
`santa` expects a `.santaconf` file in your home directory:

```json
{
  "provider": {
    "provider": "<pkgcloud-provider-name>",
    // other provider-specific options
  }
}
```

`provider` key is simply passed to [`pkgcloud.compute.createClient`](https://github.com/nodejitsu/pkgcloud#compute).

You can configure `santa` easily from command line:

```bash
santa config set provider:provider <pkgcloud-provider-name>
# ...
```

### Deployment
`santa` expects 3 files in your application:

  * `package.json`
  * `scripts/install`
  * `scripts/configure`
  * `scripts/start`

#### Scripts

##### `scripts/install`
Install all your software.

##### `scripts/configure`
Configure all your software.

##### `scripts/start`
Start all your software.

Once you set up the structure, simply execute `santa deploy` in your application
directory.

### Listing servers

```bash
santa servers list
```

### Destroying servers

```bash
santa servers destroy <id>
```

### Listing server flavors

```bash
santa flavors list
```

### Listing images

```bash
santa images list
```
