# Pull cloud metadata

Use CLI 0.4.0 or newer. Cloud pull is metadata-first. Your local project remains the source of truth; pull is not a round-trip IDE or a full source archive.

```bash
agentpaas cloud pull <component-or-deployment>
```

## Cloud pull limitations

Cloud pull writes metadata and a stub project when a richer source archive is unavailable. The local project remains the source of truth for the full implementation. Review the generated files before packing and pushing again.

To pull into a named directory:

```bash
agentpaas cloud pull weather-agent --dir ./weather-from-cloud
```

Use `--force` when the destination directory contains files that you intend to overwrite. Use `--bump-version` when you want the pulled project to use a new version before repacking.
