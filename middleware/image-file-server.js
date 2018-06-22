const send = require('koa-send')
const mime = require('mime')
const jimp = require('jimp')
const fs = require('fs')

const sendFile = (ctx, filePath) => {
    const miniType = mime.lookup(ctx.request.filePath || ctx.request.files[0])
    ctx.type = miniType + ';charset=utf-8'

    ctx.body = fs.readFileSync(filePath)
}

module.exports =  function() {
    return async function serve (ctx, next) {
        await next()

        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
            return
        }
        if (ctx.body != null || ctx.status !== 404) {
            return
        }

        try {
            sendFile(ctx, ctx.path)
            // await send(ctx, ctx.path, opts)
        } catch (err) {
            if (err.status !== 404) {
                throw err
            }
        }
    }
}