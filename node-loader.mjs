import { resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as tsNode from 'ts-node';

tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'ESNext'
  }
});

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.ts')) {
    const filePath = fileURLToPath(url);
    const source = await tsNode.compile(await Bun.file(filePath).text(), filePath);
    return {
      format: 'module',
      source
    };
  }
  return defaultLoad(url, context, defaultLoad);
}
