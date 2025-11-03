const Fuse = require('fuse-native')



// https://sveltednd.thisux.com/




let directory = {}
let open_files = {}

let file_count = 4

/**
 * app_string_conversion
 * 
 * Depending on the kind of fuse filter, this function is called just before output 
 * in order to do a conversion to a format that an importing application can 
 * use to create editable data structures.
 * 
 * @param {string} out_src 
 * @returns string
 */
function app_string_conversion(out_src) {
  return out_src
}

/*
 [
      {
        attrs: {
            mtime: new Date(),
            atime: new Date(),
            ctime: new Date(),
            nlink: 1,
            size: 12,
            mode: 33188,
            uid: process.getuid ? process.getuid() : 0,
            gid: process.getgid ? process.getgid() : 0
        },
        data : "",  // a string or buffer
        buffer : false
      }
    ]
*/


const ops = {

  readdir: function (path, cb) {
    //console.log('readdir(%s)', path)
    //
    if (path === '/') {
        let names = Object.keys(directory)
        let values = Object.values(directory)
        //
        names = names.map((name) => {
            if ( name[0] === '/' ) {
                return name.substring(1)
            }
            return name
        })
        //
        let attrs = values.map((record) => { return record.attrs })
        return process.nextTick(cb, 0, names, attrs)
    }
    //
    return process.nextTick(cb, 0)
  },

  /*
  access: function (path, cb) {
    return process.nextTick(cb, 0)
  },
  */

  getattr: function (path, cb) {
    //console.log(`getattr(${path})`)
    try {
        if (path === '/') {
            return process.nextTick(cb, 0, {
                mtime: new Date(),
                atime: new Date(),
                ctime: new Date(),
                nlink: 1,
                size: 100,
                mode: 16877,
                uid: process.getuid ? process.getuid() : 0,
                gid: process.getgid ? process.getgid() : 0
            })
        }
        if ( path[0] === '/' ) {
            let info = directory[path]
            if ( (info !== undefined) && (info.attrs !== undefined) ) {
                return process.nextTick(cb, 0, info.attrs)            
            }
        }
    } catch(e) {console.log(e)}

    return process.nextTick(cb, Fuse.ENOENT)
  },

  open: function (path, flags, cb) {
    //console.log(`open(${path}, ${flags})`)
    let opf = open_files[path]
    if ( opf === undefined ) {  // file not open (might no be created)
        opf = {
            fd : file_count++,  // file has its own id
            data : "",           // not sure about data yet
            buffer : false
        }
        open_files[path] = opf
        let info = directory[path]
        if ( info !== undefined ) { // the file is in the directory
            opf.data = info.data
            opf.buffer = info.buffer  // keeping the buffer as it was originally
        } else {
            directory[path] = {
                attrs: {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    nlink: 1,
                    size: 0,
                    mode: 33188,
                    uid: process.getuid ? process.getuid() : 0,
                    gid: process.getgid ? process.getgid() : 0
                },
                data : "",  // a string or buffer
                buffer : false
            }
        }
    }
    return process.nextTick(cb, 0, opf.fd) // fd
  },

  read: function (path, fd, buf, len, pos, cb) {
    //console.log(`read(${path}, ${fd}, ${len}, ${pos})`)
    //
    let opf = open_files[path]

    if ( opf !== undefined ) {
      let bdata = opf.buffer
      let blen = bdata.length

      let out_buf = bdata.slice(pos)

      if (!out_buf) return process.nextTick(cb, 0)
      let cplen = Math.min(len,blen)

      let output = app_string_conversion(out_buf.toString())
      //
      buf.write(output)

      return process.nextTick(cb, cplen)
    }
    return process.nextTick(cb, Fuse.EBADF)
  },
  
  
  create: function (path, flags, cb) {
    //console.log("PATH FOR CREATE: ", path," flags: ", flags)
    if ( directory[path] === undefined ) {
        directory[path] = {
            attrs: {
                mtime: new Date(),
                atime: new Date(),
                ctime: new Date(),
                nlink: 1,
                size: 0,
                mode: 33188,
                uid: process.getuid ? process.getuid() : 0,
                gid: process.getgid ? process.getgid() : 0
            },
            data : "",  // a string or buffer,
            buffer : false
        }
    }
    let opf = open_files[path]
    if ( opf === undefined ) {  // file not open (might no be created)
        opf = {
            fd : file_count++,  // file has its own id
            data : "",           // not sure about data yet
            buffer : false
        }
        open_files[path] = opf
    }

    process.nextTick(cb, 0, opf.fd)
  },

  rename: (src,dst,cb) => {
    //console.log("RENAMING: ", src," dst: ", dst)
    if ( directory[src] !== undefined ) {
        let info = directory[src]
        directory[dst] = info
        //
        delete directory[src]
        //
        let opf = open_files[src]
        if ( opf !== undefined ) {  // file not open (might no be created)
            delete open_files[src]
        }
        return process.nextTick(cb,0)
    }
    return process.nextTick(cb, Fuse.ENOENT)
  },

  unlink:(path, cb) => {
    //console.log("UNLINKING: ", path)
    if ( directory[path] !== undefined ) {
        delete directory[path]
    }
    let opf = open_files[path]
    if ( opf !== undefined ) {  // file not open (might no be created)
        delete open_files[path]
    }
    return process.nextTick(cb,0)
  },

  write : function (path, fd, buffer, length, position, cb) {
    //console.log("PATH FOR WRITE: ", path," pos: ",position, " len: ",length)

    try {
        let opf = open_files[path]
        if ( opf === undefined ) { return process.nextTick(cb, Fuse.EBADF) }
        else {
          opf.buffer = Buffer.from(buffer.slice(0, length))
          opf.data = opf.buffer.toString()
          //
          let info = directory[path]
          info.data = opf.data
          info.buffer = opf.buffer
          info.attrs.size = length
        }
    } catch (e) { console.log(e)}

    cb(length) // we handled all the data
  }

}

const fuse = new Fuse('./mnt', ops, { debug: true, displayFolder: true })
fuse.mount(err => {
  if (err) throw err
  console.log('filesystem mounted on ' + fuse.mnt)
})

process.once('SIGINT', function () {
  fuse.unmount(err => {
    if (err) {
      console.log('filesystem at ' + fuse.mnt + ' not unmounted', err)
    } else {
      console.log('filesystem at ' + fuse.mnt + ' unmounted')
    }
  })
})

