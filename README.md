# <img src="build/assets/logo/umbmarkdown-64.png" width="52" height="52"/> UmbMarkdown

This repository contains a Markdown property editor for Umbraco designed to supersede the core one.

Supports Github Flavoured Markdown and improves upon the existing core Markdown editor in many ways.

### Consuming the Solution

Hopefully the core team will agree with me that this should replace the existing editor.

In the meantime nightlies are available from [MyGet](https://www.myget.org/gallery/umbmarkdown)

A sample Nuget.config file is as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
    <add key="myget.umbmarkdown" value="https://www.myget.org/F/umbmarkdown/api/v3/index.json"/>
  </packageSources>
</configuration>
```
