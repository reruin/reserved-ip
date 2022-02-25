//https://en.wikipedia.org/wiki/Reserved_IP_addresses

const IPV4_CIDR = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',//RFC 5736
  '192.0.0.0/29',
  '192.0.0.8/32',
  '192.0.0.9/32',
  '192.0.0.10/32',
  '192.0.0.170/32',
  '192.0.0.171/32',
  '192.0.2.0/24',//RFC 5737 
  '192.31.196.0/24',
  '192.52.193.0/24',
  '192.88.99.0/24',
  '192.168.0.0/16',
  '192.175.48.0/24',
  '198.18.0.0/15',
  '198.51.100.0/24',//RFC 5737 TEST-NET-2
  '203.0.113.0/24',//RFC 5737 TEST-NET-23
  '240.0.0.0/4',
  '255.255.255.255/32'
]

const IPV6_EXP = [
  //::/128
  /^::$/,

  //::1/128
  /^::1$/,

  // ipv4
  /^::ffff:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,

  //::ffff:0:0/96
  /^::ffff:\d{1,3}(\.\d{1,3}){3}$/i,

  //::ffff:0:0:0/96
  /^::ffff:0:\d{1,3}(\.\d{1,3}){3}$/i,

  //64:ff9b::/96
  /^64:ff9b::(\d{1,3})(\.\d{1,3}){3}$/i,

  //64:ff9b:1::/48
  /^64:ff9b:1:(([\da-f]{0,4})?:){0,3}(\d{1,3})(\.\d{1,3}){3}$/i,

  //100::/64
  /^100::(:?([\da-f]{0,4})){0,4}$/i,

  //2001:0000::/32
  /^2001::(:?([\da-f]{0,4})){0,6}$/i,

  //2001:20::/28
  /^2001:2[\da-f]:(:?([\da-f]{0,4})){0,6}$/i,

  //2001:db8::/32
  /^2001:db8:(:?([\da-f]{0,4})){0,6}$/i,

  //2002::/16
  /^2002:(:?([\da-f]{0,4})){0,7}$/i,

  //fc00::/7
  /^f[cd]([\da-f]{2,2}):/i,

  //fe80::/10
  /^fe80:/i,

  //ff00::/8
  /^ff[\da-f]{2,2}:/i,

]

const intIP = (ip: string) => {
  let parts = ip.split('.').map(i => parseInt(i)), dec = 0

  for (let i = 0; i < 4; i++) {
    if (parts.length < 4) parts.splice(-1, 0, 0)
    dec += parts[i] * (1 << (8 * (3 - i)))
  }
  return dec
}

const contains = (value: number, range: Array<number>) => value >= range[0] && value <= range[1]

const IPV4_RANGES = IPV4_CIDR.map(d => {
  let parts = d.split('/')
  let hostLen = 32 - parseInt(parts[1])
  let ipbit = intIP(parts[0])
  let start = (ipbit / (2 ** hostLen) | 0) * 2 ** hostLen
  let end = start + (1 << hostLen) - 1
  return [start, end]
})

/*
const fullIPv6 = (ip: string) => {
  let parts = ip.split(':')
  parts.splice(parts.indexOf(''), 1, ...(new Array(8 + 1 - parts.length).fill(0)))
  return parts.map(i => i == '' ? '0' : i).join(':')
}
*/

const checkIPv4 = (ip: string) => IPV4_RANGES.some(r => contains(intIP(ip), r))

const checkIPv6 = (ip: string) => IPV6_EXP.some(expr => expr.test((ip)))

const isIPv4 = (ip: string) => {
  return /^0b[01]+$|^0x[\da-f]+$|^\d+$/i.test(ip) || (ip && ip.split('.').every(i => /^\d+$/.test(i) && parseInt(i) <= 255))
}

const isIPv6 = (ip: string) => {
  return /:/.test(ip) && (ip.match(/:/g)?.length || 0) < 8 && /::/.test(ip)
    ? (ip.match(/::/g)?.length == 1 && /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?$/i.test(ip))
    : /^([\da-f]{1,4}:){6}([\da-f]{1,4}:[\da-f]{1,4}|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))$/i.test(ip);
}

export default function isReservedIP(ip: string) { return isIPv4(ip) ? checkIPv4(ip) : isIPv6(ip) ? checkIPv6(ip) : undefined }

// overwrite for cjs require
module.exports = isReservedIP