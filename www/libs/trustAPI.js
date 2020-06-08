// var trust = trust &&
// {
//     logger :
//     {
//         openLog : false,

//         e : function(message)
//         {
//             if(trust.logger.openLog)
//             {
//                 console.log("trust error:" + message);
//             }
//         },

//         w : function(message)
//         {
//             if(trust.logger.openLog)
//             {
//                 console.log("trust warning:" + message);
//             }
//         }
//     }
// }


//jsbn.js
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);


// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;


//rng.js
// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if(window.crypto && window.crypto.getRandomValues) {
    // Use webcrypto if available
    var ua = new Uint8Array(32);
    window.crypto.getRandomValues(ua);
    for(t = 0; t < 32; ++t)
      rng_pool[rng_pptr++] = ua[t];
  }
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if(rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

//rsa.js
// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2Uint8(s,n) {
    if(n < s.length + 11) { // TODO: fix for utf-8
        alert("Message too long for RSA");
        return null;
    }
    var ba = new Array();
    var i = s.length - 1;
    while(i >= 0 && n > 0) {
        var c = s[i--];
        ba[--n] = c;
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = new Array();
    while(n > 2) { // random non-zero pad
        x[0] = 0;
        while(x[0] == 0) rng.nextBytes(x);
        ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else
    alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAUint8ArrayEncrypt(array) {
    var m = pkcs1pad2Uint8(array,(this.n.bitLength()+7)>>3);
    if(m == null) return null;
    var c = this.doPublic(m);
    if(c == null) return null;
    var h = c.toString(16);
    if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
RSAKey.prototype.encryptUint8 = RSAUint8ArrayEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

//trustCrypto.js
function aesEncrypt(message, keyHexStr)
{
	var key = CryptoJS.enc.Hex.parse(keyHexStr);
	
	var encrypted = CryptoJS.AES.encrypt(message, key);
	
	return encrypted;
}

function tripleDesEncrypt(message, keyHexStr)
{
	var key = CryptoJS.enc.Hex.parse(keyHexStr);
	var encrypted = CryptoJS.TripleDES.encrypt(message, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
	return encrypted;
}

function tripleDesDecrypt(message, keyHexStr)
{
    var key = CryptoJS.enc.Hex.parse(keyHexStr);
    var decrypted = CryptoJS.TripleDES.decrypt(message, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return decrypted;
}


function sha1DigestBase64(message)
{
    return Base64.encodeUint8Array(trust.hex.hexStrToUint8Array(CryptoJS.SHA1(message) + ""));//CryptoJS.SHA1(message)
}


//返回值为hexstring类型的hash值
function sha1Digest(message)
{

  return CryptoJS.SHA1(message);
}

function md5Digest(message)
{

    return CryptoJS.MD5(message);
}


//var pubN = "a8e745832ad4792735a3113ab103f5622222449dfcb68c69008f9f3452943e555749a607a6147bb79db1779a645944caa1314a077e0ffc48dfd9c2a6b5fb121e7909d84b88c02e8019746dcbb9339c037ab31ab3620524f6c61bdedaf8d68277dc59a9b0bcf804757db40b7687d9b95a7b15504073fd87c58698441d577d4bab";
//var pubN = "9d0eff07c47a27a898c18fc89fd25b21898885b5a97054e81684e22bf13cd8725e7ff03ba2f8c1ad8c998952a30a65ff61ecbdb042661b8813e7a936de3474a51eb8a05458f7b357d95bb4f55741380403c1148108dfab4399af45d351deebaabffff552c10c6cd1599bc87642d37af5d474138a37fb60cdb7dcb3dbb9872a29";
var pubN = "af634ebf6c1a1401fff01753ffff9c790b574a3fe3c41ccc37647d88f53892a0cffc9d4d93886eb323dfc24502dccdc4317a3d6ac5cb99c6d29fd0314ef3ac42835282a7fc1ecaa94f7ca5f6aa26444c7eab12f127c1e5feeb29c49c37c0afe0493d1b73414e86203c261a70089a4921d2af298ab24ff87bfdb06469be171b53";

var pubE = "10001";
//var encCertSN = "1021020000067221ed";
//var encCertSN = "0980990000019ecf6a";
var encCertSN = "01";

//return base64 result
function rsaPubkeyEnc(pubkeyN, pubkeyE, plainText)
{
	var rsa = new RSAKey();
	rsa.setPublic(pubkeyN, pubkeyE);
	var res = rsa.encrypt(plainText);//hex str result encryptUint8

    var uint8Res = trust.hex.hexStrToUint8Array(res);

    return Base64.encodeUint8Array(uint8Res);
}

//return base64 result
function rsaPubkeyUint8Enc(pubkeyN, pubkeyE, uint8Array)
{
    var rsa = new RSAKey();
    rsa.setPublic(pubkeyN, pubkeyE);
    var res = rsa.encryptUint8(uint8Array);//hex str result

    var uint8Res = trust.hex.hexStrToUint8Array(res);
    return Base64.encodeUint8Array(uint8Res);
}

//return base64 result
function rsaPubkeyEncByDefault(plainText)
{
	return rsaPubkeyEnc(pubN, pubE, plainText);
}

//return base64 result
function rsaPubkeyUint8EncByDefault(uint8Array)
{
    return rsaPubkeyUint8Enc(pubN, pubE, uint8Array);
}

//return base64 result
function rsaPubkeyUint8EncByPubKey(uint8Array,certPubKey)
{
    return rsaPubkeyUint8Enc(certPubKey, pubE, uint8Array);
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

encodeUint8Array : function (uint8Array)
{
    var CHUNK_SIZE = 0x8000; //arbitrary number
    var index = 0;
    var length = uint8Array.length;
    var result = '';
    var slice;
    var slice_tmp = "";

    while (index < length) {
        slice = uint8Array.subarray(index, Math.min(index + CHUNK_SIZE, length));

        for (var i = 0, len = slice.length; i < len; i++) {
            slice_tmp += String.fromCharCode(slice[i]);
        }

        result += slice_tmp;
        index += CHUNK_SIZE;
        slice_tmp = "";
    }


    return btoa(result);

	//return btoa(String.fromCharCode.apply(null, uint8Array)); on some device , throw arguments list wrong type error
},

decodeUint8ArrayB64 : function (arrayB64)
{
	return new Uint8Array(atob(arrayB64).split("").map(function(c) {return c.charCodeAt(0); }));
},

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c= 0, c1 = 0, c2 = 0, c3=0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}

var trust = trust ||
{
    binary :
    {
        uint32ArrayToUint8Array : function(uint32Array)
        {
            if(!uint32Array)
            {
                return null;
            }

            var uint8 = new Uint8Array(uint32Array.length * 4);


            var offset;
            for(var i= 0, size=uint32Array.length; i<size; i++)
            {
                offset = (i << 2);
                uint8[offset] = ((uint32Array[i] >> 24) & 0xff);
                uint8[offset + 1] = ((uint32Array[i] >> 16) & 0xff);
                uint8[offset + 2] = ((uint32Array[i] >> 8) & 0xff);
                uint8[offset + 3] = uint32Array[i] & 0xff;
            }

            return uint8;
        }
    },

    hex :
    {
        hexEncodeArray : [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
        ],

        uint8ArrayToHexStr : function (array)
        {
            if(!array)
            {
                return null;
            }
            var res = '';

            for (var i = 0; i < array.length; i++) {
                var code = array[i];
                res += this.hexEncodeArray[code >>> 4];
                res += this.hexEncodeArray[code & 0x0F];
            }

            return res;
        },

        hexStrToUint8Array : function (hexStr)
        {
            if(!hexStr || hexStr.length % 2 != 0)
            {
                return null;
            }

            var a = [];

            for (var i = 0; i < hexStr.length; i += 2) {
                a.push(parseInt("0x" + hexStr.substr(i, 2), 16));
            }

            return new Uint8Array(a);
        },

        hexStrToUint8Str : function (hexStr)
        {
            if(!hexStr || hexStr.length % 2 != 0)
            {
                return null;
            }

            var _utf8 = "";
            for (var i = 0; i < hexStr.length; i += 2) {
                _utf8 += String.fromCharCode(parseInt("0x" + hexStr.substr(i, 2), 16));
            }
            return decodeURIComponent(escape(_utf8));

        }
    },

    charset :
    {
        strToUtf8ArrayUint8 : function(str)
        {
            var utf8= unescape(encodeURIComponent(str));
            var arr= new Uint8Array(utf8.length);
            for (var i= 0; i<utf8.length; i++)
                arr[i]= utf8.charCodeAt(i);
            return arr;
        },

        utf8ArrayUint8ToStr : function(bytes)
        {
            var _utf8 = "";

            for (var j= 0; j<bytes.length; j++)
            {
                //alert(String.fromCharCode(arr[j]));
                _utf8 += String.fromCharCode(bytes[j]);
            }


            return decodeURIComponent(escape(_utf8))
        },

        toUtf8str : function(str)
        {
            return unescape(encodeURIComponent(str));
        },

        uint8ArrayAscIIToStr : function(uint8Array)
        {
            return String.fromCharCode.apply(null, uint8Array);
        },

        strToUint8ArrayAscII : function(str)
        {
            var res = new Uint8Array(str.length);
            for(var i=0,j=str.length;i<j;++i){
                res[i]=str.charCodeAt(i);
            }
            return res;
        }
    },

    zip :
    {
        compressToB64 : function(dataUint8)
        {
            var deflate = new Zlib.Deflate(dataUint8);
            var compressed = deflate.compress();

            //on android 3.0 devices , compressed is Array, so convert to uint8 array
            if(compressed instanceof Array)
            {
                var u8Array = new Uint8Array(compressed.length);
                for(var i=0,j=u8Array.length;i<j;++i){
                    u8Array[i]=compressed[i];
                }
                compressed = u8Array;
            }


            return Base64.encodeUint8Array(compressed);
        }
    },

    json :
    {
        stringify : function(obj)
        {
            return JSON.stringify(obj);
        },
        stringToObj : function(str)
        {
            return JSON.parse(str);
        }
    },

    digest :
    {
        crc32 : function(msgStr)
        {
            var crcTable = [];
            if(!window.crcTable)
            {
                var c;
             
                for(var n =0; n < 256; n++){
                    c = n;
                    for(var k =0; k < 8; k++){
                        c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                    }
                    crcTable[n] = c;
                }

                window.crcTable = crcTable;
            }
			else
			{
				crcTable = window.crcTable;
			}

            var crc = 0 ^ (-1);

            for (var i = 0; i < msgStr.length; i++ ) {
                crc = (crc >>> 8) ^ crcTable[(crc ^ msgStr.charCodeAt(i)) & 0xFF];
            }

            return (crc ^ (-1)) >>> 0;
        }
    }
};

//JcorsLoader
(function(e){function k(){for(var b=!0,a,g=l,c=d.length;g<c&&b;)if(a=d[g],void 0!==a&&null!==a){if("string"===typeof a){var f=m.cloneNode(!1);f.text=a;h.parentNode.insertBefore(f,h)}else a.apply(e);a=g;d[a]=null;l=a+1;g+=1}else b=!1}function f(){if(d.length){var b=d.pop(),a;"string"===typeof b?(a=m.cloneNode(!0),a.type="text/javascript",a.async=!0,a.src=b,a.onload=a.onreadystatechange=function(){if(!a.readyState||/loaded|complete/.test(a.readyState))a.onload=a.onreadystatechange=null,a=void 0,f()},
h.parentNode.insertBefore(a,h)):(b.apply(e),f())}}function p(b,a){return function(){d[a]=b.responseText;k();b=void 0}}function q(){var b=arguments.length,a,c;for(a=0;a<b;a+=1)"string"===typeof arguments[a]?(c=i(arguments[a]),c.onload=p(c,d.length),d[d.length]=null,c.send()):(d[d.length]=arguments[a],k())}function r(){d.push(Array.prototype.slice.call(arguments,0).reverse());f()}var n=e.document,m=n.createElement("script"),h=n.getElementsByTagName("script")[0],d=[],l=0,i,c,j;e.XMLHttpRequest&&(c=new e.XMLHttpRequest,
"withCredentials"in c?j=function(b){c=new e.XMLHttpRequest;c.open("get",b,!0);return c}:e.XDomainRequest&&(j=function(b){c=new e.XDomainRequest;c.open("get",b);return c}));i=j;e.JcorsLoader={load:i?q:r}})(window);



//uint8 array implements
(function() {

    try {
        var a = new Uint8Array(1);

        return; //no need
    } catch(e) { }

    function subarray(start, end) {
        return this.slice(start, end);
    }

    function set_(array, offset) {
        if (arguments.length < 2) offset = 0;
        for (var i = 0, n = array.length; i < n; ++i, ++offset)
            this[offset] = array[i] & 0xFF;
    }

// we need typed arrays
    function TypedArray(arg1) {
        var result;
        if (typeof arg1 === "number") {
            result = new Array(arg1);
            for (var i = 0; i < arg1; ++i)
                result[i] = 0;
        } else
            result = arg1.slice(0);
        result.subarray = subarray;
        result.buffer = result;
        result.byteLength = result.length;
        result.set = set_;
        if (typeof arg1 === "object" && arg1.buffer)
            result.buffer = arg1.buffer;

        return result;
    }

    window.Uint8Array = TypedArray;
    window.Uint32Array = TypedArray;
    window.Int32Array = TypedArray;
})();


(function() {
    if ("response" in XMLHttpRequest.prototype ||
        "mozResponseArrayBuffer" in XMLHttpRequest.prototype ||
        "mozResponse" in XMLHttpRequest.prototype ||
        "responseArrayBuffer" in XMLHttpRequest.prototype)
        return;
    Object.defineProperty(XMLHttpRequest.prototype, "response", {
        get: function() {
            return new Uint8Array( new VBArray(this.responseBody).toArray() );
        }
    });
})();

(function() {
    if ("btoa" in window)
        return;

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    window.btoa = function(chars) {
        var buffer = "";
        var i, n;
        for (i = 0, n = chars.length; i < n; i += 3) {
            var b1 = chars.charCodeAt(i) & 0xFF;
            var b2 = chars.charCodeAt(i + 1) & 0xFF;
            var b3 = chars.charCodeAt(i + 2) & 0xFF;
            var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
            var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
            var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
            buffer += digits.charAt(d1) + digits.charAt(d2) + digits.charAt(d3) +      digits.charAt(d4);
        }
        return buffer;
    };
})();

//window.crypto.getRandomValues implements
var capabal = capabal ||
{
    crypto :
    {
        getRandomValues : function(array)
        {
            var tmp, current, top = array.length;
            if(top)
            {
                while(--top)
                {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = array[current];
                    array[current] = array[top];
                    array[top] = tmp;
                }
            }
            return array;
        }
    }
}

//android 2.0 to dataUrl implement

function toUInt(number) {
    return number<0?number+4294967296:number;
};

function bytes32(number) {
    return [(number>>>24)&0xff,(number>>>16)&0xff,(number>>>8)&0xff,number&0xff];
};

function bytes16sw(number) {
    return [number&0xff,(number>>>8)&0xff];
};


function adler32(obj, start,len){
    switch(arguments.length){ case 1:start=0; case 2:len=obj.length-start; }
    var a=1,b=0;
    for(var i=0;i<len;i++){
        a = (a+obj[start+i])%65521; b = (b+a)%65521;
    }
    return toUInt(((b << 16) | a));
};

function crc32(obj, start,len){
    switch(arguments.length){ case 1:start=0; case 2:len=obj.length-start; }
    var table=arguments.callee.crctable;
    if(!table){
        table=[];
        var c;
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++)
                c = c & 1?0xedb88320 ^ (c >>> 1):c >>> 1;
            table[n] = toUInt(c);
        }
        arguments.callee.crctable=table;
    }
    var c = 0xffffffff;
    for (var i = 0; i < len; i++)
        c = table[(c ^ obj[start+i]) & 0xff] ^ (c>>>8);

    return toUInt((c^0xffffffff));
};


(function(){
    var toDataURL=function(){
        var imageData=Array.prototype.slice.call(this.getContext("2d").getImageData(0,0,this.width,this.height).data);
        var w=this.width;
        var h=this.height;
        var stream=[
            0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a,
            0x00,0x00,0x00,0x0d,0x49,0x48,0x44,0x52
        ];
        Array.prototype.push.apply(stream, bytes32(w) );
        Array.prototype.push.apply(stream, bytes32(h) );
        stream.push(0x08,0x06,0x00,0x00,0x00);
        Array.prototype.push.apply(stream, bytes32(crc32(stream,12,17)) );
        var len=h*(w*4+1);
        for(var y=0;y<h;y++)
            imageData.splice(y*(w*4+1),0,0);
        var blocks=Math.ceil(len/32768);
        Array.prototype.push.apply(stream, bytes32((len+5*blocks+6)) );
        var crcStart=stream.length;
        var crcLen=(len+5*blocks+6+4);
        stream.push(0x49,0x44,0x41,0x54,0x78,0x01);
        for(var i=0;i<blocks;i++){
            var blockLen=Math.min(32768,len-(i*32768));
            stream.push(i==(blocks-1)?0x01:0x00);
            Array.prototype.push.apply(stream, bytes16sw(blockLen));
            Array.prototype.push.apply(stream, bytes16sw((~blockLen)) );
            var id=imageData.slice(i*32768,i*32768+blockLen);
            Array.prototype.push.apply(stream, id );
        }
        Array.prototype.push.apply(stream, bytes32(adler32(imageData)) );
        Array.prototype.push.apply(stream, bytes32(crc32(stream, crcStart, crcLen)) );

        stream.push(0x00,0x00,0x00,0x00,0x49,0x45,0x4e,0x44);
        Array.prototype.push.apply(stream, bytes32(crc32(stream, stream.length-4, 4)));
        return "data:image/png;base64,"+btoa(stream.map(function(c){ return String.fromCharCode(c); }).join(''));
    };

    var tdu=HTMLCanvasElement.prototype.toDataURL;

    HTMLCanvasElement.prototype.toDataURL=function(type){

        var res=tdu.apply(this,arguments);
        if(res == "data:,"){
            HTMLCanvasElement.prototype.toDataURL=toDataURL;
            return this.toDataURL();
        }else{
            HTMLCanvasElement.prototype.toDataURL=tdu;
            return res;
        }
    }

})();


//Trust data package beans
/**
 * EncKey变更为SessionKey
 EncCertSN删除
 EncDataDig->SignReqDig
 EncData->SignReq
 * */
var TrustRoot = function()
{
    this.Version = "1.0";
  //  this.EncCertSN = null;// 不再需要该字段
    this.SessionKey = null;// EncKey--->SessionKey
//    this.TermSrc = "PAD";//Browser
    this.SignReqDig = null;// EncDataDig->SignReqDig
    this.SignReq = null;// EncData->SignReq
}

var SignReqDig = function()
{
    this.Alg = null;
    this.Value = null;
}

var FormInfo = function()
{
    this.Channel = null;
    this.UserSign = [];
    this.OriginalData = null;
    this.UnitSign = [];
}

/** 签名 */
var UserSign = function()
{
    this.SignType = 0;
    this.SignRule = null;
    this.Signer = null;
    this.CertOID = null;
    this.Snapshot = null;
    this.Image = null;
    this.Format = "image/png";// 手写图片增加类型格式 "image/gif"、"image/jpeg"、"image/png"
}

var SignRule = function()
{
    this.RuleType = 0;
    this.Tid = null;
    this.KWRule = null;
    this.XYZRule = null;
}

var KWRule = function()
{
    this.KW = null;
    this.KWIndex = 0;
    this.XOffset = 0;
    this.YOffset = 0;
    this.SigWidth = 100;
    this.SigHeight = 80;
}

var XYZRule = function()
{
    this.Left = 100.0;
    this.Right = 100.0;
    this.Top = 100.0;
    this.Bottom = 100.0;
    this.Pageno = 1;
}

var Snapshot = function()
{
    this.IDAuth = [];
    this.Behavior = [];
    this.PlainHash = null;
    this.Script = null;

}

var IDAuth = function()
{
    this.type = 0;
    this.descript = null;
}

var Behavior = function()
{
    this.index = 0; //报文中无该参数，用于区分自采手写签名和用户设置的证据 （-2手写签名hash/0用户设置证据）
    this.type = 0;
    this.HashValue = null;
    this.CredLevel = 1;
}

/**
 *CertOID
 **/
var CertOID = function()
{
    this.Version = "1.0";
    this.SnapshotHash = null;
}

/**原文*/
var OriginalData = function()
{
    this.OriginalType = 0;
    this.HtmlData = null;
    this.XMLNode = null;
    this.PDFData = null;
}
var XMLNode = function()
{
    this.Data = null;
    this.DocConvertTid = 0;
}

/**单位章*/
var UnitSign = function()
{
    this.SignRule = null;
    this.AppName = null;
    this.Image = null;
    this.IsTSS = true;
}


/*
 * TrustSign 2016 All Right Reserved
 * @author han
 */

//dialog return constants
CALLBACK_TYPE_SIGNATURE = 1;//签名框点击确认之后的回调，回调中包含签名快照
CALLBACK_TYPE_DIALOG_CANCEL = 2;//点击签名框"取消"按钮时的回调，同时也会触发dismiss回调
//CALLBACK_TYPE_DIALOG_DISMISS = 3;//签名框dismiss时的回调

//functions return value

/**
 * 初始化 1101
 **/
RESULT_OK = 0;//操作成功
ERROR_INIT_CALLBACK_EXCEPTION = 110101;//初始化时，回调函数不满足要求
ERROR_API_NOT_INITED = 110102;//接口未初始化错误

/**
 * 设置商户号 1102
 **/
ERROR_BUSINESSID_INVALID = 110201;//检测到未设置商户号或者商户号不符合要求

/**
 * 设置证书公钥
 **/
ERROR_SERVERCERT_INVALID = 110301;//证书公钥未设置或格式不对

/**
 * 设置原文模板数据 1104
 **/
ERROR_ORIGINAL_CONFIG_INVALID = 110401;//原文配置对象错误或者为空
ERROR_ORIGINAL_TYPE_INVALID = 110402;//原文类型错误或者为空
ERROR_ORIGINAL_CONTENT_INVALID = 110403;//原文内容错误或者为空
ERROR_ORIGINAL_XSLTID_INVALID = 110404;//当原文类型为XML时，模板号配置错误或者未配置

/**
 * 添加手写签名配置信息 1105
 **/
ERROR_USERSIGN_CONFIG_INVALID = 110501;//配置用户签名时，配置对象有误或者为空
ERROR_USERSIGN_SIGNER_INVALID = 110502;//配置用户签名时，签名人信息有误或者为空
ERROR_USERSIGN_SIGNRULE_INVALID = 110503;//配置用户签名时，签名规则信息有误或者为空

/**
 * 添加身份鉴别方式 1106
 **/
ERROR_IDMODE_SIGNCONFIG_INVALID = 110601;//配置身份鉴别手段时，获取签名配置信息失败或者未配置签名

/**
 * 添加证据数据 1107
 **/
ERROR_EVIDENCE_SIGNCONFIG_INVALID = 110701;//配置证据数据时，获取签名配置信息失败或者未配置签名

/**
 * 显示手写签名输入框 1108
 **/
//ERROR_SHOWSIGNBOARD_TEMPLATE_INVALID = 110801;//显示签名框时，未配置模板（不再限制模板是否必须，服务端可传模板原文）
ERROR_SHOWSIGNBOARD_SIGNCONFIG_INVALID = 110802;//显示签名框时，获取签名配置信息失败或者未配置签名

/**
 * 添加公章配置信息 1109
 **/
ERROR_UNITSIGN_CONFIG_INVALID = 110901;//配置单位章时，配置对象有误或者为空
ERROR_UNITSIGN_SIGNRULE_INVALID = 110902;//配置单位章时，签名规则信息有误或者为空

/**
 * 判断数据是否准备就绪 1110
 **/
ERROR_ISREADY_BUSINESS_INVALID = 111001;//上传是否就绪时，检测到未设置商户号
ERROR_ISREADY_SERVERCERT_INVALID = 111002;//上传是否就绪时，证书公钥未设置或格式不对
ERROR_ISREADY_ATLEASTONESIGN =111003;//上传是否就绪时，至少要有一个签名

/**
 * 获取加密包数据 1111
 **/
ERROR_ISREADY_BUSINESS_INVALID = 111001;//上传是否就绪时，检测到未设置商户号
ERROR_ISREADY_SERVERCERT_INVALID = 111002;//上传是否就绪时，证书公钥未设置或格式不对
ERROR_ISREADY_ATLEASTONESIGN =111003;//上传是否就绪时，至少要有一个签名

/**
 * 设置短信签名码接口 1112
 **/
ERROR_MESSAGE_CODE_INVALID = 111201;//短信签名码不正确
ERROR_MESSAGE_PHONE_INVALID = 111202;//短信签名码手机号格式不正确
ERROR_MESSAGE_SIGNCONFIG_INVALID = 111203;//获取短信签名码相关的签名配置信息有误

/**
 * 重置API 1112
 **/

/**
 * 销毁API 1113
 **/

/**
 * 设置算法标识 1114
 **/

function trustWebImpl()
{

    //variables
    var mCallback;
    var mChannel;
    var mCertPubKey; //公钥

    var mIsInitialized = false;//是否初始化
    var mTemplateSet = false;//是否设置模板
    var mIsSetMsgSignCode = false;//是否设置短信签约码，设置了，因为与签名具有同等地位

    var originalData = null;//put originalData here
    var signDataArray = [];//put signData here
    var signConfigArray = [];//put signConfigData here
    var unitSignArray = []; //put unitSign here



    var mCertSerialNum = encCertSN;//证书序列号（随便填写）
//    var originalHash = null;//16进制原文hash


    /**
     * 初始化签名对象，通常从打开客户端到关闭客户端，中间只需要初始化一次。
     * 要求回调函数至少有3个参数，参数定义如下面callback参数定义
     * @param apiCallback Function with 3 params(int callback_type, int index, String data)
     * @returns {int} 是否初始化成功以及是否回调函数参数满足要求
     */
    this._initTrustSignApi = function(apiCallback)
    {
        if(apiCallback && (apiCallback instanceof Function) && apiCallback.length >= 3)
        {
            _resetVariables();
            mCallback = apiCallback;
            mIsInitialized = true;
            return RESULT_OK;
        }
        else
        {
            return ERROR_INIT_CALLBACK_EXCEPTION;
        }

    };

    /**
     * 设置商户号
     * @param businessId 商户号
     * @returns {int} 商户号是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_BUSINESSID_INVALID 检测到未设置商户号或者商户号不符合要求
     * @errorCode RESULT_OK：操作成功
     */
    this._setTBusiness = function(businessId)
    {
        if(!mIsInitialized){
            return  ERROR_API_NOT_INITED;
        }
        if(!businessId || businessId.length != 16){
            return ERROR_BUSINESSID_INVALID;
        }
        else{
            mChannel = businessId;
            return RESULT_OK;
        }

    };

    /**
     * 设置证书公钥
     * @param certPubKey 证书公钥
     * @returns {int} 证书公钥是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_SERVERCERT_INVALID 证书公钥未设置或格式不对
     * @errorCode RESULT_OK：操作成功
     */
    this._setTServerCert = function(certPubKey)
    {
        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }
        if(!certPubKey){
            return ERROR_SERVERCERT_INVALID;
        }else{
            mCertPubKey = certPubKey;
            return RESULT_OK;
        }
    };


    /**
     * 设置原文数据
     * @param originalConfig 配置签字相应属性，具体参考demo或者文档
     * @returns {int} 是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_ORIGINAL_CONFIG_INVALID  原文配置对象错误或者为空
     * @errorCode ERROR_ORIGINAL_TYPE_INVALID    原文类型错误或者为空
     * @errorCode ERROR_ORIGINAL_CONTENT_INVALID 原文类型错误或者为空
     * @errorCode ERROR_ORIGINAL_XSLTID_INVALID  当原文类型为XML时，模板号配置错误或者未配置
     * @errorCode RESULT_OK 操作成功
     */
    this._setTOriginal = function(originalConfig)
    {
        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }else{
            if(originalConfig && originalConfig instanceof OriginalConfig){

                if(!originalConfig.originalType){
                    return ERROR_ORIGINAL_TYPE_INVALID;
                }

                if(!originalConfig.originalBase64Str){
                    return ERROR_ORIGINAL_CONTENT_INVALID;
                }

//              不再计算，服务端计算
//                var plainHash = sha1Digest(originalConfig.originalBase64Str);
//                originalHash = "BASE64:" +(plainHash.toString()).toUpperCase();

                originalData = new OriginalData();
                if(originalConfig.originalType === OriginalType.HTML){

                    originalData.OriginalType  = OriginalType.HTML;
                    originalData.HtmlData = originalConfig.originalBase64Str;

                    mTemplateSet = true;
                    return RESULT_OK;

                }

                if(originalConfig.originalType === OriginalType.PDF){

                    originalData.OriginalType  = OriginalType.PDF;
                    originalData.PDFData = originalConfig.originalBase64Str;

                    mTemplateSet = true;
                    return RESULT_OK;
                }

                if(originalConfig.originalType === OriginalType.XML){

                    if(!originalConfig.xsltID){
                        return ERROR_ORIGINAL_XSLTID_INVALID;
                    }
                    originalData.OriginalType  = OriginalType.XML;
                    var xmlNode = new XMLNode();
                    xmlNode.Data = originalConfig.originalBase64Str;
                    xmlNode.DocConvertTid = originalConfig.xsltID;
                    originalData.XMLNode = xmlNode;

                    mTemplateSet = true;
                    return RESULT_OK;
                }

                return ERROR_ORIGINAL_TYPE_INVALID;

            }else{
               return ERROR_ORIGINAL_CONFIG_INVALID;
            }
        }

    };


    /**
     * 配置一个签名对象
     * @param signatureIndex 签名的索引值，代表第几个签名
     * @param userSignConfig 配置签字相应属性，具体参考demo或者文档
     * @returns {int} 是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_USERSIGN_CONFIG_INVALID  配置用户签名时，配置对象有误或者为空
     * @errorCode ERROR_USERSIGN_SIGNER_INVALID  配置用户签名时，签名人信息有误或者为空
     * @errorCode ERROR_USERSIGN_SIGNRULE_INVALID  配置用户签名时，签名规则信息有误或者为空
     * @errorCode RESULT_OK 操作成功
     */
    this._addTUserSign = function(signatureIndex, userSignConfig)
    {
        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }else{
            if(userSignConfig && userSignConfig instanceof UserSignConfig){

                if(!userSignConfig.signer){
                    return ERROR_USERSIGN_SIGNER_INVALID;
                }

                if(!userSignConfig.signRule){
                    return ERROR_USERSIGN_SIGNRULE_INVALID;
                }

                userSignConfig.signIndex = signatureIndex;
                signConfigArray[signatureIndex] = userSignConfig;

                var holder = new UserSign();
                holder.SignType = 1;//1为签名，2为批注，3位签约码
                holder.Signer = userSignConfig.signer;
                var signRule_holder = new SignRule();

                if(userSignConfig.signRule instanceof SignRule_KeyWord){
                    signRule_holder.RuleType = 1;
                    signRule_holder.KWRule = userSignConfig.signRule;
                }
                if(userSignConfig.signRule instanceof SignRule_XYZ){
                    signRule_holder.RuleType = 2;
                    signRule_holder.XYZRule = userSignConfig.signRule;
                }
                if(userSignConfig.signRule instanceof SignRule_ServerConfig){
                    signRule_holder.RuleType = 3;
                    signRule_holder.Tid = userSignConfig.signRule.ruleId;
                }
                holder.SignRule = signRule_holder;

                signDataArray[signatureIndex] = holder;
                return RESULT_OK;

            }else{
                return ERROR_USERSIGN_CONFIG_INVALID;
            }
        }
    };



    /**
     * 配置一个签章对象
     * @param unitSignConfig 配置公章相应属性，具体参考demo或者文档
     * @returns {int} 是否设置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_UNITSIGN_CONFIG_INVALID  配置单位章时，配置对象有误或者为空
     * @errorCode ERROR_UNITSIGN_SIGNRULE_INVALID  配置单位章时，签名规则信息有误或者为空
     * @errorCode RESULT_OK 操作成功
     */
    this._addTUnitSign = function(unitSignConfig)
    {
        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }else{
            if(unitSignConfig && unitSignConfig instanceof UnitSignConfig){

                if(!unitSignConfig.signRule){
                    return ERROR_UNITSIGN_SIGNRULE_INVALID;
                }

                var holder = new UnitSign();
                var signRule_holder = new SignRule();
                if(unitSignConfig.signRule instanceof SignRule_KeyWord){
                    signRule_holder.RuleType = 1;
                    signRule_holder.KWRule = unitSignConfig.signRule;
                }
                if(unitSignConfig.signRule instanceof SignRule_XYZ){
                    signRule_holder.RuleType = 2;
                    signRule_holder.XYZRule = unitSignConfig.signRule;
                }
                if(unitSignConfig.signRule instanceof SignRule_ServerConfig){
                    signRule_holder.RuleType = 3;
                    signRule_holder.Tid = unitSignConfig.signRule.ruleId;
                }
                holder.SignRule = signRule_holder;
//                holder.IsTSS = unitSignConfig.openTSS; //默认True,不支持更改
                holder.IsTSS = true;
                holder.AppName = unitSignConfig.AppName;

                unitSignArray.push(holder);

                return RESULT_OK;

            }else{
                return ERROR_UNITSIGN_CONFIG_INVALID;
            }
        }
    };

    /**
     * 添加身份鉴别方式
     * @param signIndex 签名的索引值，代表向第几个签名添加身份鉴别方式
     * @param mode  鉴别手段类型: 1:见面审核 2：身份证联网核查 3:人脸 4:手机号验证 5：邮箱验证 6:银行卡验证 7:第三方支付验证 8：第三方CA验证 100:其他验证
     * @param contentBase64Str
     *         type = 1时，contentBase64Str是姓名（UTF8编码）+证件类型+证件号码——>base64编码
     *         type = 2时，contentBase64Str是姓名（UTF8编码）+证件类型+证件号码——>base64编码
     *         type = 3时，contentBase64Str为空
     *         type = 4时，contentBase64Str是手机号码——>base64编码
     *         type = 5时，contentBase64Str是邮箱地址——>base64编码
     *         type = 6时，contentBase64Str是姓名（UTF8编码）+银行卡号——>base64编码
     *         type = 7时，contentBase64Str是集成商输入字符串——>base64编码
     *         type = 8时，contentBase64Str是集成商输入字符串——>base64编码
     *         type = 100时，contentBase64Str是集成商输入字符串——>base64编码，原文的BASE64编码数据
     * @returns {int} 是否配置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_IDMODE_SIGNCONFIG_INVALID 配置身份鉴别手段时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
    this._addTIdentificationMethod = function(signIndex,mode,contentBase64Str)

    {

        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }else{

            var holder = signDataArray[signIndex];
            if(!holder){
                return ERROR_IDMODE_SIGNCONFIG_INVALID;
            }else{
                if(!holder.Snapshot)
                {
                    holder.Snapshot = new Snapshot();
                }

                var idAuth = new IDAuth();
                idAuth.type = mode;
                idAuth.descript = contentBase64Str;

                if(!holder.Snapshot.IDAuth)
                {
                    holder.Snapshot.IDAuth =[];
                    holder.Snapshot.IDAuth.push(idAuth);

                    return RESULT_OK;
                }else{
                    holder.Snapshot.IDAuth.push(idAuth);

                    return RESULT_OK;
                }

            }
        }
    };


    /**
     * 添加签名证据
     * @param signIndex  对应的签名的索引值，代表向第几个签名添加证据
     * @param contentBase64Str 证据内容，原文的BASE64编码数据
     * @param evidenceType 证据类型，枚举类型 ，参考EvidenceType
     * @returns {int} 是否配置成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_EVIDENCE_SIGNCONFIG_INVALID 配置证据数据时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
    this._addTEvidence = function(signIndex,contentBase64Str,evidenceType)
    {
        if(!mIsInitialized){
            return ERROR_API_NOT_INITED;
        }else{

            var holder = signDataArray[signIndex];
            if(!holder){
                return ERROR_EVIDENCE_SIGNCONFIG_INVALID;
            }else{

                //mHash_photo保存图片hash值，hash值为hexstring的全大写
                var mHash = sha1Digest(contentBase64Str);//直接对原文的base64计算hash
                var hash_base64 = "BASE64:" + (mHash.toString()).toUpperCase();

//                添加用户设置的证据，index为0
                _addInnerOrUserEvidence(holder,0,hash_base64, evidenceType);

                return RESULT_OK;

            }
        }
    };


    /**
     * 弹出手写签名框
     * @param signIndex 之前配置的签名索引值
     * @return {int} 是否成功弹出
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_SHOWSIGNBOARD_SIGNCONFIG_INVALID 显示签名框时，获取签名配置信息失败或者未配置签名
     * @errorCode RESULT_OK 操作成功
     */
    this._showTSignBoard = function(signIndex)
    {

        if(!mIsInitialized)
        {
            return ERROR_API_NOT_INITED;
        }

        else if(signConfigArray[signIndex] == null)
        {
            return ERROR_SHOWSIGNBOARD_SIGNCONFIG_INVALID;
        }
        else
        {

            var configObj = signConfigArray[signIndex];
            var signDataObj = signDataArray[signIndex];


            var bh = getWindowHeight();
            var bw = getWindowWidth();



            var dlg = document.getElementById("dialog");
            dlg.style.height = bh;
            dlg.style.width = bw;
            dlg.style.display = "block";

            var title = document.getElementById("trust_title");//refer to the div tag
            var titleText = configObj.title;
            var signer = titleText.substring(configObj.titleHighLightStart, configObj.titleHighLightEnd + 1).big();

            title.innerHTML = titleText.substring(0,configObj.titleHighLightStart) + signer + titleText.substring(configObj.titleHighLightEnd + 1, titleText.length);//set text in the div tag

            setSignResCallback(configObj, function(cid, bigData, data, trackData, trackPtCount, sigBoardWidth, sigBoardHeight)
            {
                if(mCallback)
                {
                    if(data)
                    {
                        //TODO track data process
                        //compress point data to holder
                        _compressSigToHolder(signDataObj, configObj.penColor, trackData, trackPtCount);
                        // sourceData 回显图片
                       // signDataObj.Image = sourceData;// data
                        signDataObj.Image = data;//
//                        设置图片hash到证据域。添加手写签名图片hash到证据域中
                      //  var mHash = sha1Digest(sourceData);//直接对原文的base64计算hash// data
                        var mHash = sha1Digest(data);//直接对原文的base64计算hash//
                        var hash_base64 = "BASE64:" + (mHash.toString()).toUpperCase();
                        _addInnerOrUserEvidence(signDataObj,-2, hash_base64, EvidenceType.TYPE_HANDWRITE);


//                      updata SignRule if exists
                        if(signDataObj.SignRule)
                        {
                            if(signDataObj.SignRule.RuleType === 1)//KeyWord
                            {
                                var stampWidthHeight = changePDFSignArea(calculatedSigWidth,calculatedSigHeight,configObj.signAreaWidth,configObj.signAreaHeight);
                              //  signDataObj.SignRule.KWRule.SigWidth = parseInt(stampWidthHeight[0]);
                              //  signDataObj.SignRule.KWRule.SigHeight = parseInt(stampWidthHeight[1]);
                                // 暂时后台统一处理签名区域，后台做矢量
                                signDataObj.SignRule.KWRule.SigWidth = parseInt(configObj.signAreaWidth);
                                signDataObj.SignRule.KWRule.SigHeight = parseInt(configObj.signAreaHeight);
                                signDataObj.SignRule.KWRule.XOffset =  parseFloat(configObj.signRule.XOffset).toFixed(2);
                                signDataObj.SignRule.KWRule.YOffset =  parseFloat(configObj.signRule.YOffset).toFixed(2);

                            }
                            if(signDataObj.SignRule.RuleType === 2)//XYZ
                            {
                                var xyzSub = configObj.signRule;
                                var stampWidthHeight = changePDFSignArea(calculatedSigWidth,calculatedSigHeight,configObj.signAreaWidth,configObj.signAreaHeight);
                                var leftPos = parseFloat(xyzSub.Left).toFixed(2);
                                var topPos = parseFloat(xyzSub.Top).toFixed(2);
                                // 暂时后台统一处理签名区域，后台做矢量
                       //         var rightPos = parseFloat(Number(xyzSub.Left) + Number(stampWidthHeight[0])).toFixed(2);
                       //        var bottomPos = parseFloat(Number(xyzSub.Top) - Number(stampWidthHeight[1])).toFixed(2);
                                var rightPos = parseFloat(Number(xyzSub.Right) ).toFixed(2);
                                var bottomPos = parseFloat(Number(xyzSub.Bottom) ).toFixed(2);
                                signDataObj.SignRule.XYZRule = {Left:leftPos, Top: topPos,Right: rightPos, Bottom: bottomPos, Pageno:xyzSub.Pageno};

                            }
                        }

                        mCallback(CALLBACK_TYPE_SIGNATURE,configObj.signIndex, bigData);
                    }
                    else
                    {
                        mCallback(CALLBACK_TYPE_DIALOG_CANCEL,configObj.signIndex, null);
                    }
                    clear_canvas();
                    var dlg = document.getElementById("dialog");
                    dlg.style.display = 'none';

                    setIsTrustInputDlgShown(false);
                }
            });

            setIsTrustInputDlgShown(true);
            return RESULT_OK;
        }
    };


    /**
     * 设置短信签名码接口，与showTSignBoard()可叠加使用，也可单独使用，但二者至少有一个
     * @param signIndex 之前配置的签名索引值
     * @param msgCode 短信签名码
     * @param phoneNum 手机号
     * @return {int} 是否成功
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_MESSAGE_CODE_INVALID 短信验证码不正确
     * @errorCode ERROR_MESSAGE_PHONE_INVALID 手机号格式不正确
     * @errorCode ERROR_MESSAGE_SIGNCONFIG_INVALID 获取短信签名码相关的签名配置信息有误
     * @errorCode RESULT_OK 操作成功
     */
    this._setTMsgSignCode = function(signIndex,msgCode,phoneNum)
    {
        if(!mIsInitialized)
        {
            return ERROR_API_NOT_INITED;
        }
        if(!msgCode)
        {
            return ERROR_MESSAGE_CODE_INVALID;
        }
        if(!phoneNum || !checkPhone(phoneNum))
        {
            return ERROR_MESSAGE_PHONE_INVALID;
        }
        if(signDataArray[signIndex] == null)
        {
            return ERROR_MESSAGE_SIGNCONFIG_INVALID;
        }

        var signConfigobj = signConfigArray[signIndex];

        var sigObj = signDataArray[signIndex];
        sigObj.SignType = 3;//1为签名，2为批注，3位签约码

        var signerName =sigObj.Signer.UName;

        var signImgWidth = signConfigobj.signAreaWidth;
        var signImgHeight = signConfigobj.signAreaHeight;

        if(signImgWidth/signImgHeight  >= signerName.length){
            signImgHeight = signImgHeight;
            signImgWidth = signImgHeight * signerName.length;

        }else{
            signImgWidth = signImgWidth;
            signImgHeight = signImgWidth/signerName.length;
        }


        var sourceData = textToImg(signerName,signImgHeight*signConfigobj.signImgRatio,signConfigobj.penColor);

        //TODO track data process
        //TODO compress point data to holder
//        _compressSigToHolder(signDataObj, configObj.penColor, trackData, trackPtCount);

        sigObj.Image = sourceData;

//        设置图片hash到证据域。添加手写签名图片hash到证据域中
        var mHash = sha1Digest(sourceData);//直接对原文的base64计算hash
        var hash_base64 = "BASE64:" + (mHash.toString()).toUpperCase();
        _addInnerOrUserEvidence(sigObj,-2, hash_base64, EvidenceType.TYPE_HANDWRITE);

//        作为短信签名码添加到证据中
        _addInnerOrUserEvidence(sigObj,0, phoneNum +":"+ msgCode, EvidenceType.TYPE_MESSAGE);


        //set xyz_rule if exists
        if(sigObj.SignRule)
        {
            if(sigObj.SignRule.RuleType === 1)//KeyWord
            {
                sigObj.SignRule.KWRule.SigWidth = parseInt(signConfigobj.signAreaWidth);
                sigObj.SignRule.KWRule.SigHeight = parseInt(signConfigobj.signAreaHeight);
                sigObj.SignRule.KWRule.XOffset =  signConfigobj.signRule.XOffset;
                sigObj.SignRule.KWRule.YOffset =  signConfigobj.signRule.YOffset;
            }
            if(sigObj.SignRule.RuleType === 2)//XYZ
            {
                var xyzSub = signConfigobj.signRule;

                var stampWidthHeight = changePDFSignArea(calculatedSigWidth,calculatedSigHeight,signConfigobj.signAreaWidth,signConfigobj.signAreaHeight);

                var leftPos = parseFloat(xyzSub.Left).toFixed(2);
                var topPos = parseFloat(xyzSub.Top).toFixed(2);
                var rightPos = parseFloat(Number(xyzSub.Left) + Number(stampWidthHeight[0])).toFixed(2);
                var bottomPos = parseFloat(Number(xyzSub.Top) - Number(stampWidthHeight[1])).toFixed(2);
                sigObj.SignRule.XYZRule = {Left:leftPos, Top: topPos,Right: rightPos, Bottom: bottomPos, Pageno:xyzSub.Pageno};

            }
        }

        mIsSetMsgSignCode = true;

        return RESULT_OK;
    };


    /**
     * 一次业务完成后，调用此接口判断上传数据是否准备就绪
     * @return {int} 是否准备就绪
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_ISREADY_BUSINESS_INVALID 上传是否就绪时，检测到未设置商户号
     * @errorCode ERROR_ISREADY_SERVERCERT_INVALID 上传是否就绪时，证书公钥未设置或格式不对
     * @errorCode ERROR_ISREADY_ATLEASTONESIGN 上传是否就绪时，至少要有一个签名
     * @errorCode RESULT_OK 操作成功
     */
    this._isReadyToGen = function()
    {

        if(!mIsInitialized)
        {
            return ERROR_API_NOT_INITED;
        }else if(!mCertPubKey)
        {
            return ERROR_ISREADY_SERVERCERT_INVALID;
        }
        else if(!mChannel)//商户号
        {
            return ERROR_ISREADY_BUSINESS_INVALID;
        }else{

            var atLeastOneSign = false;

            for(var key in signConfigArray)
            {
                /**如果signConfig用的同一个，obj.signIndex始终是最后一个index值 **/
                var obj = signConfigArray[key];
                var cid = obj.signIndex;
                var signObj = signDataArray[cid];


//                if((signObj == null ||signObj.Snapshot == null|| signObj.Snapshot.Script == null || signObj.Image == null) && obj.necessary)
//                {
//                    return ERROR_ISREADY_NOT_SIGN;
//                }else{
//                    atLeastOneSign = true;
//                }

                if((signObj != null && signObj.Snapshot != null && signObj.Image != null) || (signObj != null && mIsSetMsgSignCode))
                {
                    atLeastOneSign = true;
                }

            }

            if(!atLeastOneSign){
                return ERROR_ISREADY_ATLEASTONESIGN;
            }

            return RESULT_OK;
        }

    };


    /**
     * 一次业务完成后，调用此接口获取加密数据
     * @return {} 是否准备就绪
     * @errorCode ERROR_API_NOT_INITED 接口未初始化错误
     * @errorCode ERROR_ISREADY_BUSINESS_INVALID 上传是否就绪时，商户号为空或格式不证书
     * @errorCode ERROR_ISREADY_SERVERCERT_INVALID 上传是否就绪时，证书公钥未设置或格式不对
     * @errorCode ERROR_ISREADY_ATLEASTONESIGN 上传是否就绪时，至少要有一个签名
     * @errorCode RESULT_OK 操作成功
     */
    this._GenTEncData = function()
    {

        var res = this._isReadyToGen();
        if(res === RESULT_OK){
            var root = new TrustRoot();
            var form = new FormInfo();

            //gen encryption key
            var random = new Uint8Array(24);
            if(window.crypto != undefined)
            {
                window.crypto.getRandomValues(random);
            }
            else if(window.msCrypto != undefined)
            {
                window.msCrypto.getRandomValues(random);
            }
            else
            {
                capabal.crypto.getRandomValues(random);
            }

            root.SessionKey = rsaPubkeyUint8EncByPubKey(random,mCertPubKey);//  EncKey--->SessionKey
           // root.EncCertSN = mCertSerialNum;// 不再需要改字段

            var sigs = [];

            for (var key in signConfigArray)
            {

                var obj = signConfigArray[key];
                var cid = obj.signIndex;
                var signObj = signDataArray[key];

                if(!signObj.Snapshot){
                    signObj.Snapshot = new Snapshot();
                }

//                不再计算原文hash,服务端计算
//                if(!signObj.CertOID){
//                    signObj.CertOID = new CertOID();
//                }
//                signObj.Snapshot.PlainHash = originalHash;
//                var certOID = new CertOID();
//                certOID.SnapshotHash = sha1DigestBase64(trust.json.stringify(signObj.Snapshot)) + "";
//                signObj.CertOID = Base64.encode(trust.json.stringify(certOID));

                if(signDataArray[cid].Image || signDataArray[cid].SignType == 3){
                    sigs.push(signDataArray[cid]);
                }

            }


            form.Channel = mChannel;

            form.UserSign = sigs;
            form.UnitSign = unitSignArray;
            form.OriginalData = originalData;

            var toEnc = trust.json.stringify(form);

            root.SignReq = tripleDesEncrypt(toEnc, trust.hex.uint8ArrayToHexStr(random)) + "";

            root.SignReqDig = new SignReqDig();
            root.SignReqDig.Alg = "CRC32";
            root.SignReqDig.Value = trust.digest.crc32(root.SignReq).toString(16).toUpperCase();

            return trust.json.stringify(root);

        }else{
            return res;
        }

    };


    /**
     * 重置API，开始一次新业务
     * 前一次业务的签名、拍照等数据会被清空
     * @returns {boolean} 是否重置成功
     */
    this._resetTAPI = function()
    {
        _resetVariables();
        return true;
    };


    /**
     * 销毁API
     * 所有数据会被清空，包括API
     * @returns {boolean} 是否销毁成功
     */
    this._finalizeTAPI = function()
    {
        _resetVariables();
        return true;
    };


    /**
     * 添加证据
     * param signObj 签名对象
     * param index 第几个证据，-2自采手写签名，0用户设置的证据
     * param hash 证据hash
     * param type 证据类型
     * @returns {void} 是否销毁成功
     */
    function _addInnerOrUserEvidence(signObj,index,hash, type)
    {
        if(!signObj.Snapshot)
        {
            signObj.Snapshot = new Snapshot();
        }

        if(!signObj.Snapshot.Behavior || signObj.Snapshot.Behavior.size ===0 || signObj.Snapshot.Behavior.length === 0)
        {
            var behavior = new Behavior();
            behavior.type = type;
            behavior.index = index;
            behavior.HashValue = hash;
            behavior.CredLevel = 1;

            var behaviors = [];
            behaviors.push(behavior);
            signObj.Snapshot.Behavior = behaviors;

        }else{

            for(var i=0;i< signObj.Snapshot.Behavior.length;i++){
                var behavior = signObj.Snapshot.Behavior[i];
                if(behavior.index  == index === -2){
                    behavior.HashValue = hash;
                    return ;
                }
            }

            var behavior = new Behavior();
            behavior.type = type;
            behavior.index = index;
            behavior.HashValue = hash;
            behavior.CredLevel = 1;

            signObj.Snapshot.Behavior.push(behavior);

        }

    };


    /**
     * 获取操作系统信息，格式为"操作系统名##版本号"，如"android##4.1.2"、"ios##7.1.2"
     * @returns {String} 版本信息
     */
    this._getOSInfo = function()
    {
        if(isMobile.Android())
        {
            /*var userAgent = navigator.userAgent.toLowerCase();
             var version_info = userAgent.split(";")[1];
             var version_str = (version_info+"").replace(/[^0-9.]/ig,"");
             var version_float = parseFloat(version_str.trim().toString());*/

            var userAgent = navigator.userAgent.toLowerCase();

            var startIndex = userAgent.indexOf("android");

            var endIndex = userAgent.indexOf(";", startIndex);

            startIndex += 8;

            var osStr = userAgent.substring(startIndex, endIndex);
            return ("android##" + osStr);
        }
        else if(isMobile.iOS())
        {
            var userAgent = navigator.userAgent;
            var startIndex;
            var endIndex;
            var osStr;
            if((startIndex = userAgent.indexOf("OS")) != -1 && ((endIndex = userAgent.indexOf("like Mac OS")) != -1))
            {
                osStr = userAgent.substring(startIndex+3,endIndex - 1);

                osStr = osStr.replace(/_/g, ".");

                return ("ios##" + osStr);
            }

        }
        return "unknown";
    };


    /**
     * reset数据
     */
    function _resetVariables()
    {
        mCallback = null;
        mChannel = null;
        mCertPubKey = null;

        mIsInitialized = false;
        mTemplateSet = false;
        mIsSetMsgSignCode = false;

        originalData =  null;
        signDataArray = [];
        signConfigArray = [];
        unitSignArray = [];

    };






}


/**
 *
 * @param holder SignData
 * @param trackData string
 * @param trackPtCount int
 * @private
 */
function _compressSigToHolder(holder, penColor, trackData, trackPtCount)
{
    if(!holder.Snapshot)
    {
        holder.Snapshot = new Snapshot();
    }
    holder.Snapshot.Script = trust.zip.compressToB64(trust.charset.strToUint8ArrayAscII(trackData));
//
//        var script = holder.Points.CertOID.BioFeature.Script;
//        script.Color = parseInt("0x" + penColor.substr(1)) + "";
//
//        script.Data = trust.zip.compressToB64(trust.charset.strToUint8ArrayAscII(trackData));
//        script.Count = trackPtCount + "";
//        script.Device = new Device();

}

/**
 *
 * @param signImageWidth 签名图片宽度
 * @param signImageHeight 签名图片高度
 * @param stampWidth 签名框宽度
 * @param stampHeight 签名框高度
 */
function changePDFSignArea(signImageWidth,signImageHeight, stampWidth, stampHeight)
{
    var stampWidthHeight = [];

    // 签名图片宽高都小于用户设置的签名框的话，签名框大小默认为签名图片的大小
    if (signImageWidth <= stampWidth && signImageHeight <= stampHeight)
    {
        stampWidth = signImageWidth;
        stampHeight = signImageHeight;
    } else
    {
        if (signImageHeight / signImageWidth > stampHeight / stampWidth)
        {
            stampWidth = stampHeight * signImageWidth / signImageHeight;
        } else
        {
            stampHeight = stampWidth * signImageHeight / signImageWidth;
        }
    }
    stampWidthHeight[0] = stampWidth;
    stampWidthHeight[1] = stampHeight;

    return stampWidthHeight;
}



function textToImg(signImgFontContent,signImgFontSize,signImgFontColor) {
    //默认值--每行默认字数
    var signImgFontLength = 5;
    //默认值--默认字体
    var signImgFontWeight = "bold";

    var len = signImgFontLength || 5;
    var i = 0;
    var fontSize = signImgFontSize || 30;
    var fontWeight = signImgFontWeight || 'normal';
    var txtContent = signImgFontContent;

    var canvas = document.createElement('canvas');

    if (txtContent == '') {
        alert('请配置签名人信息！');
    }
    if (len > txtContent.length) {
        len = txtContent.length;
    }
    canvas.width = fontSize * len;
    canvas.height = fontSize * (Math.ceil(txtContent.length / len) + txtContent.split('\n').length - 1);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = signImgFontColor;
    context.font = fontWeight + ' ' + fontSize + 'px sans-serif';
    context.textBaseline = 'top';

    canvas.style.display = 'none';

    function fillTxt(text) {
        while (text.length > len) {
            var txtLine = text.substring(0, len);
            text = text.substring(len);
            context.fillText(txtLine, 0, fontSize * i++, canvas.width);
        }
        context.fillText(text, 0, fontSize * i, canvas.width);
    }
    //支持文本换行写入
    var txtArray = txtContent.split('\n');
    for ( var j = 0; j < txtArray.length; j++) {
        fillTxt(txtArray[j]);
        context.fillText('\n', 0, fontSize * i++, canvas.width);
    }
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");

    return data.substr(22, data.length);

}


function checkPhone(phoneNum) {

    if(/^1[3|4|5|7|8][0-9]{9}$/.test(phoneNum)){
        return true;
    }else{
        return false;
    }
}


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};



var points = [];//保存当前笔画轨迹
var firstPointTime = 0;
var signTrack = "";//保存签名轨迹
var signTrachPointCount = 0;//签名轨迹点个数

var calculatedSigWidth = 0;//签名完毕点击确认后，生成的签名宽dp值(物理尺寸)
var calculatedSigHeight = 0;//签名完毕点击确认后，生成的签名高dp值(物理尺寸)

var minX = 9999, minY = 9999, maxX = 0, maxY = 0;
var curX = 0,curY = 0;
var lastX = 0, lastY = 0;
var paste_padding = 10;//px
var imageDataTmp;
var isDown = false; //判断是否按下
var isDrawn = false;//判断是否有涂鸦
var isTrustInputDlgShown = false;
var isCopyingImg = false;

//var base_stroke_width = (window.innerWidth >= 480 ? 5 : 2.5);
var base_stroke_width = (window.innerWidth >= 480 ? 7.5 : 5);

var tmp_canvas;
var tmp_ctx;

var signResCallback;
var signObjTmp;

var bh_temp = getWindowHeight();
var bw_temp = getWindowWidth();

function ismobile(test){
    var u = navigator.userAgent, app = navigator.appVersion;
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
        if(window.location.href.indexOf("?mobile")<0){
            try{
                if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                    return '0';
                }else{
                    return '1';
                }
            }catch(e){}
        }
    }else if( u.indexOf('iPad') > -1){
        return '0';
    }else{
        return '1';
    }
};

window.addEventListener('resize', function()
{
//    alert("window resize");
    var pla=ismobile(1);
    if(pla == 1){
        var canvas = document.getElementById('trustCanvas');
        var ctx = canvas.getContext('2d');
        //var tmp = ctx.getImageData(0, 0, canvas.width , canvas.height);
        var tmp_canvas_private;
        var tmp_ctx_private;

        var width;
        var height;

        var tmp;

        if(isDrawn)//only initialize when drawn
        {
            tmp_canvas_private = document.createElement('canvas');
            tmp_ctx_private = tmp_canvas_private.getContext('2d');

            var default_padding = paste_padding;
            var fixedPaddingL = default_padding,fixedPaddingT = default_padding, fixedPaddingR = default_padding, fixedPaddingB = default_padding, left,top, right, bottom;
            if((left = (minX - default_padding)) < 0)
            {
                fixedPaddingL = minX;
                left = 0;
            }
            if((top = (minY - default_padding)) < 0)
            {
                fixedPaddingT = minY;
                top = 0;
            }
            if((right = (maxX + default_padding)) > canvas.width)
            {
                fixedPaddingR = 0;
                right = canvas.width;
            }
            if((bottom = (maxY + default_padding)) > canvas.height)
            {
                fixedPaddingB = 0;
                bottom = canvas.height;
            }

            width = maxX - minX + fixedPaddingL + fixedPaddingR;
            height = maxY - minY + fixedPaddingT + fixedPaddingB;

            tmp = ctx.getImageData(left, top, right - left, bottom - top);

            tmp_canvas_private.width = width;
            tmp_canvas_private.height = height;

            /* old version
             width = maxX-minX + paste_padding + paste_padding;
             height = maxY-minY + paste_padding + paste_padding;

             tmp = ctx.getImageData(minX - paste_padding, minY - paste_padding, width + paste_padding, height + paste_padding);

             tmp_canvas_private.width = width;
             tmp_canvas_private.height = height;*/
        }


        var bh = getWindowHeight();
        var bw = getWindowWidth();

        var dlg = document.getElementById("dialog");
        dlg.style.height = bh + "px";
        dlg.style.width = bw + "px";

        if(canvas.width<10){
            canvas.width = bw*canvas.width;
        }

        if(canvas.width<bw){
            canvas.width = bw;
        }
        canvas.height = bh * 0.7;

        var container_canvas = document.getElementById("container");
        container_canvas.style.overflowX = "scroll";
        container_canvas.style.overflowY = "hidden";
        container_canvas.style.height = bh * 0.7 + "px";

        //set btn container's marginTop attribute
//    var container = document.getElementById("btnContainerOuter");

        var title = document.getElementById("trust_title");
        title.style.height = bh * 0.1 + "px";

        // var single_scrollbar = document.getElementById("single_scrollbar");
        // single_scrollbar.style.height = bh * 0.1+"px";

        var container = document.getElementById("btnContainerOuter");
        container.style.height = bh * 0.1 + "px";


    }else if(pla == 0){//ipone
        var bh;
        var bw;
        if(window.orientation == 0 || window.orientation == 180){//shuping
            bh = bh_temp;
            bw = bw_temp;
        }else{
            var bhw = getWindowHeight();
            var bww = getWindowWidth();
            bh = bhw;
            bw = bww;
        }



            var canvas = document.getElementById('trustCanvas');
            var ctx = canvas.getContext('2d');
            //var tmp = ctx.getImageData(0, 0, canvas.width , canvas.height);
            var tmp_canvas_private;
            var tmp_ctx_private;

            var width;
            var height;

            var tmp;

            if(isDrawn)//only initialize when drawn
            {
                tmp_canvas_private = document.createElement('canvas');
                tmp_ctx_private = tmp_canvas_private.getContext('2d');

                var default_padding = paste_padding;
                var fixedPaddingL = default_padding,fixedPaddingT = default_padding, fixedPaddingR = default_padding, fixedPaddingB = default_padding, left,top, right, bottom;
                if((left = (minX - default_padding)) < 0)
                {
                    fixedPaddingL = minX;
                    left = 0;
                }
                if((top = (minY - default_padding)) < 0)
                {
                    fixedPaddingT = minY;
                    top = 0;
                }
                if((right = (maxX + default_padding)) > canvas.width)
                {
                    fixedPaddingR = 0;
                    right = canvas.width;
                }
                if((bottom = (maxY + default_padding)) > canvas.height)
                {
                    fixedPaddingB = 0;
                    bottom = canvas.height;
                }

                width = maxX - minX + fixedPaddingL + fixedPaddingR;
                height = maxY - minY + fixedPaddingT + fixedPaddingB;

                tmp = ctx.getImageData(left, top, right - left, bottom - top);

                tmp_canvas_private.width = width;
                tmp_canvas_private.height = height;

                /* old version
                 width = maxX-minX + paste_padding + paste_padding;
                 height = maxY-minY + paste_padding + paste_padding;

                 tmp = ctx.getImageData(minX - paste_padding, minY - paste_padding, width + paste_padding, height + paste_padding);

                 tmp_canvas_private.width = width;
                 tmp_canvas_private.height = height;*/
            }



            var dlg = document.getElementById("dialog");
            dlg.style.height = bh + "px";
            dlg.style.width = bw + "px";

//    canvas.width = bw;//(window.innerWidth > 0) ? window.innerWidth : screen.width;
            canvas.height = bh;//(window.innerHeight > 0) ? window.innerHeight : screen.height;
            if(canvas.width<10){
                canvas.width = bw*canvas.width;
            }

            if(canvas.width<bw){
                canvas.width = bw;
            }

            if(window.orientation == 0 || window.orientation == 180){
                canvas.height = canvas.height * 0.7;

                var container_canvas = document.getElementById("container");
                container_canvas.style.overflowX = "scroll";
                container_canvas.style.overflowY = "hidden";
                container_canvas.style.height = bh * 0.7 + "px";

                //set btn container's marginTop attribute
//    var container = document.getElementById("btnContainerOuter");

                var title = document.getElementById("trust_title");
                title.style.height = bh * 0.1 + "px";

//    var single_scrollbar = document.getElementById("single_scrollbar");
//    single_scrollbar.style.height = bh * 0.1+"px";

                var container = document.getElementById("btnContainerOuter");
                container.style.height = bh * 0.2 + "px";

                var contianerInner = document.getElementById("btnContainerInner");
//        contianerInner.style.marginTop = container.style.height;
                contianerInner.style.marginBottom = 0;
            }else{
                canvas.height = canvas.height * 0.6;

                var container_canvas = document.getElementById("container");
                container_canvas.style.overflowX = "scroll";
                container_canvas.style.overflowY = "hidden";
                container_canvas.style.height = bh * 0.6 + "px";

                //set btn container's marginTop attribute
//    var container = document.getElementById("btnContainerOuter");

                var title = document.getElementById("trust_title");
                title.style.height = bh * 0.1 + "px";

//    var single_scrollbar = document.getElementById("single_scrollbar");
//    single_scrollbar.style.height = bh * 0.1+"px";

                var container = document.getElementById("btnContainerOuter");
                container.style.height = bh * 0.3 + "px";
                var contianerInner = document.getElementById("btnContainerInner");
                contianerInner.style.marginBottom = container.style.height;
            }
    }





    if(tmp_canvas != null)//reset size of doodle board
    {
        tmp_canvas.width = canvas.width;
        tmp_canvas.height = canvas.height;
    }

    //reset inner variables before drawing
    var pixalRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    var screenSizeRatio = bw * canvas.height / 142560;

    base_stroke_width = pixalRatio * screenSizeRatio * 2.4;

    ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
    ctx.lineWidth = base_stroke_width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 5;


    tmp_ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
    tmp_ctx.lineWidth = base_stroke_width;
    tmp_ctx.lineCap = 'round';
    tmp_ctx.lineJoin = 'round';
    tmp_ctx.shadowBlur = 5;

    if(!isDrawn)//just resize
    {
        tmp_canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);//clear any remaining sig
        return;
    }


    var scaleFactor;

    if(canvas.width > width)
    {
        /*if(canvas.width / canvas.height > width / height)
         {
         scaleFactor = canvas.height / height;
         }
         else
         {
         scaleFactor = canvas.width / width;
         }*/
        if(canvas.height >= height)
        {
            scaleFactor = 1;//don't scale
        }
        else
        {
            scaleFactor = canvas.height / height;
        }
    }
    else
    {
        if(canvas.width / canvas.height > width / height)
        {
            scaleFactor = canvas.height / height;
        }
        else
        {
            scaleFactor = canvas.width / width;
        }
    }

    tmp_ctx_private.putImageData(tmp, 0, 0);

    var tmp_canvas_private_2 = document.createElement('canvas');
    var tmp_ctx_private_2 = tmp_canvas_private_2.getContext('2d');
    tmp_canvas_private_2.width = width * scaleFactor;
    tmp_canvas_private_2.height = height * scaleFactor;
    tmp_ctx_private_2.scale(scaleFactor, scaleFactor);
    tmp_ctx_private_2.drawImage(tmp_canvas_private, 0, 0);

    ctx.clearRect(0,0,canvas.width,canvas.height);//clear any remaining sig
    ctx.drawImage(tmp_canvas_private_2, 0, 0);

    /*
     minX = 0;
     minY = 0;
     maxX = width * scaleFactor;
     maxY = height * scaleFactor;*/
    minX = 0;
    minY = 0;
    maxX *= scaleFactor;
    maxY *= scaleFactor;

    tmp_canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);//clear any remaining sig
});

 function _singleSignCanvas()
{
    //    添加单签窗口及画布
    onload_singleSignCanvas();

    //    加载单字签名对话框的滚动按钮事件
    onload_singleSingScrollAction();
};

function onload_singleSignCanvas(){
    // if (document.getElementById('trustCanvas'))
    // {
        //var ctx = $('#ctx').get(0).getContext('2d'); //取得画布
        /*var canvas = document.getElementById('trustCanvas');
         var ctx = canvas.getContext('2d');*/
        // Creating a tmp canvas
        var canvas = document.getElementById('trustCanvas');
        var ctx = canvas.getContext('2d');

        //canvas.width = $(window).width();
        //canvas.height = $(window).height() * 0.7;

        var windowHeight = getWindowHeight();//(window.innerHeight > 0) ? window.innerHeight : screen.height;
        var windowWidth = getWindowWidth();//(window.innerWidth > 0) ? window.innerWidth : screen.width;

        if(canvas.width<10){
            canvas.width = windowWidth*canvas.width;
        }

        if(canvas.width<windowWidth){
            canvas.width = windowWidth;
        }

        var container = document.getElementById('container');
        container.style.overflowX = "scroll";
        container.style.overflowY = "hidden";
        canvas.height = windowHeight * 0.7;
7
        //alert("$(window).width()=" + $(window).width() + " $(window).height()=" + $(window).height());

        //alert("availHeight=" + screen.availHeight + " availWidth=" + screen.availWidth);
        /* if(window.devicePixelRatio !== undefined)
         {
         alert(window.devicePixelRatio);
         }
         */
        var title = document.getElementById("trust_title");
        title.style.height = windowHeight * 0.1 + "px";

        // var single_scrollbar = document.getElementById("single_scrollbar");
        // single_scrollbar.style.height = windowHeight * 0.1 + "px";

        var container = document.getElementById("btnContainerOuter");
        container.style.height = windowHeight * 0.1 + "px";
        /*var contianerInner = document.getElementById("btnContainerInner");

         contianerInner.style.marginTop = container.style.height / 2 - contianerInner.style.height / 2 + "px";
         alert("contianerInner=" + contianerInner);
         alert("value=" + (document.getElementById("btnOK").style.height + "px"));
         alert("contianerInner.style.marginTop=" +contianerInner.style.marginTop)*/;




        var pixalRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
        var screenSizeRatio = windowWidth * canvas.height / 142560;

        base_stroke_width = pixalRatio * screenSizeRatio * 2.4;


        var container = document.getElementById('container');
        tmp_canvas = document.createElement('canvas');
        tmp_ctx = tmp_canvas.getContext('2d');
        tmp_canvas.id = 'tmp_canvas';
        tmp_canvas.width = canvas.width;
        tmp_canvas.height = canvas.height;

        container.appendChild(tmp_canvas);

        if('ontouchstart' in document.documentElement)
        {
            tmp_canvas.ontouchstart = function(e)
            {
                if(isCopyingImg)
                {
                    return false;
                }

                e.preventDefault();
                //ctx.beginPath();//开始画线
                isDown = true;
                //ctx.moveTo(e.offsetX, e.offsetY); //画笔拿起放到哪一点
                if (e.touches) e = e.touches[0];
                return false;//important
            };
            tmp_canvas.ontouchmove = function(e)
            {
                // !isDown || ctx.lineTo(e.clientX - 10, e.clientY - 10, 5, 5); //画笔画到哪一点
                if(isDown && !isCopyingImg)
                {
                    var offset = JQuery_Capable.offset(e.target);

                    if (typeof e.targetTouches !== 'undefined') {
                        //ontouchmove事件走这里
                        //ontouchmove事件中e.clientX = undefined,e.pageX = 0
                        //所以 Y的话，通过取点击位置减去top即可，但是假如点击位置在button按钮区域，需要减去按钮区域超出的位置（即点击位置区域不能超过画布区域），这里没有减
                        //所有向 points中push的前提加上curY <= canvas.height ,宽不必考虑，因为宽度全屏，不会点击到屏幕外
                        curX = Math.floor(e.targetTouches[0].pageX - offset.left);
                        curY = Math.floor(e.targetTouches[0].pageY - offset.top);
                    } else {
                        curX = Math.floor(e.pageX - offset.left);
                        curY = Math.floor(e.pageY - offset.top);
                    }

                    var mill = e.timeStamp;
                    if(signTrachPointCount === 0 && !isNaN(mill))
                    {
                        firstPointTime = mill;
                    }

                    if(curX > 0 && curY <= canvas.height){
                        if(!isNaN(mill))//we store track data now
                        {
                            signTrack += (curX + "," + curY + "," + base_stroke_width + "," + (mill - firstPointTime) + "\n");
                        }
                        else
                        {
                            signTrack += (curX + "," + curY + "," + base_stroke_width + "," + 0 + "\n");
                        }

                        signTrachPointCount += 1;

                        if(curX > maxX)
                        {
                            maxX = curX;
                        }
                        if(curX < minX)
                        {
                            minX = curX;
                        }
                        if(curY > maxY)
                        {
                            maxY = curY;
                        }
                        if(curY < minY)
                        {
                            minY = curY;
                        }

                        points.push({x:curX , y: curY});
                        onPaint();

                        lastX = curX;
                        lastY = curY;
                    }


                    preventDefault(e);//prevent event from passing behind this div
                }
            };
            tmp_canvas.ontouchend = function(e)
            {
                var mill = e.timeStamp;

                if(!isNaN(mill))//we store track data now
                {
                    signTrack += ("0,0," + -1 + "," + (mill - firstPointTime) + "\n");
                }
                else
                {
                    signTrack += ("0,0," + -1 + "," + 0 + "\n");
                }

                signTrachPointCount += 1;

                /////////////////////////////////////////////
                isCopyingImg = true;
                isDown = false;
                var canvas = document.getElementById('trustCanvas');
                var ctx = canvas.getContext('2d');

                /////////////////////////////// this solves HuaWei bug
                /*var data_canvas = document.createElement('canvas');
                 data_canvas.width = tmp_canvas.width;

                 data_canvas.height = tmp_canvas.height;

                 data_canvas.getContext('2d').putImageData(tmp_ctx.getImageData(0,0,tmp_canvas.width, tmp_canvas.height),0,0);

                 ctx.drawImage(data_canvas, 0, 0);*/
                /////////////////////////////////////
                ctx.drawImage(tmp_canvas, 0, 0);


                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

                points = [];
                isCopyingImg = false;
            };

            tmp_canvas.ontouchcancel = tmp_canvas.ontouchend;
        }
        else
        {
            tmp_canvas.onmousedown = function(e)
            {
                //ctx.beginPath();//开始画线
                isDown = true;
                //ctx.moveTo(e.offsetX, e.offsetY); //画笔拿起放到哪一点
            };
            tmp_canvas.onmousemove = function(e)
            {
                // !isDown || ctx.lineTo(e.clientX - 10, e.clientY - 10, 5, 5); //画笔画到哪一点
                if(isDown)
                {
                    var offset = JQuery_Capable.offset(e.target);
                    var windowScrollOffsetTop = document.body.scrollTop | document.documentElement.scrollTop;//$(window).scrollTop();
                    var windowScrollOffsetLeft = document.body.scrollLeft | document.documentElement.scrollLeft;//$(window).scrollLeft();

                    if (typeof e.targetTouches !== 'undefined') {
                        curX = Math.floor(e.targetTouches[0].clientX - offset.left);
                        curY = Math.floor(e.targetTouches[0].clientY - offset.top);
                    } else {
                        //onmousemove事件走这里
                        //onmousemove事件中e.clientX = e.pageX,e.clientY = e.pageY
                        curX = Math.floor(e.clientX - offset.left);
                        curY = Math.floor(e.clientY - offset.top);
                    }

                    var mill = e.timeStamp;
                    if(signTrachPointCount === 0 && !isNaN(mill))
                    {
                        firstPointTime = mill;
                    }
                    if(curX > 0){
                        if(!isNaN(mill))
                        {
                            signTrack += (curX + "," + curY + "," + base_stroke_width + "," + (mill - firstPointTime) + "\n");
                        }
                        else
                        {
                            signTrack += (curX + "," + curY + "," + base_stroke_width + "," + 0 + "\n");
                        }
                        signTrachPointCount += 1;

                        curY += windowScrollOffsetTop;
                        curX += windowScrollOffsetLeft;

                        //if(e.clientX <= canvas.width && e.clientY <= canvas.height)//on canvas
                        //{
                        if(curX > maxX)
                        {
                            maxX = curX;
                        }
                        if(curX < minX)
                        {
                            minX = curX;
                        }
                        if(curY > maxY)
                        {
                            maxY = curY;
                        }
                        if(curY < minY)
                        {
                            minY = curY;
                        }

                        points.push({x:curX , y: curY});
                        onPaint();

                        lastX = curX;
                        lastY = curY;
                    }


                    preventDefault(e);

                }
            };
            tmp_canvas.onmouseup = function(e)
            {
                //insert this down point
                var offset = JQuery_Capable.offset(e.target);

                if (typeof e.targetTouches !== 'undefined') {
                    curX = Math.floor(e.targetTouches[0].clientX - offset.left);
                    curY = Math.floor(e.targetTouches[0].clientY - offset.top);
                } else {
                    curX = Math.floor(e.clientX - offset.left);
                    curY = Math.floor(e.clientY - offset.top);
                }

                var mill = e.timeStamp;

                if(!isNaN(mill))//we store track data now
                {
                    signTrack += ("0,0," + -1 + "," + (mill - firstPointTime) + "\n");
                }
                else
                {
                    signTrack += ("0,0," + -1 + "," + 0 + "\n");
                }

                signTrachPointCount += 1;

                /////////////////////////////////////////

                isDown = false;
                //ctx.closePath();
                var canvas = document.getElementById('trustCanvas');
                var ctx = canvas.getContext('2d');
                ctx.drawImage(tmp_canvas, 0, 0);
                // Clearing tmp canvas
                tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

                points = [];
            };

            tmp_canvas.onmouseout = tmp_canvas.onmouseup;
        }



        var scaleFactor = window.devicePixelRatio ? window.devicePixelRatio : 1;



        ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
        ctx.lineWidth = base_stroke_width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 5;


        tmp_ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
        tmp_ctx.lineWidth = base_stroke_width;
        tmp_ctx.lineCap = 'round';
        tmp_ctx.lineJoin = 'round';
        tmp_ctx.shadowBlur = 5;
    // }
    // else
    // {
    //     alert('你的浏览器不支持canvas标签,请使用firefox和chrome浏览器');
    // }

}

function onload_singleSingScrollAction(){

    var scroll_width = 0;
    var current_scroll_pos =0;
    var should_scroll_pos = 0; //应该滑到的位置

    var single_container = document.getElementById('container');

    single_container.addEventListener("scroll",function(){
        current_scroll_pos = single_container.scrollLeft;
    });
//  左一页
//     var single_scrollbar_up = document.getElementById('single_scrollbar_up');
//     single_scrollbar_up.addEventListener("click",function(){

//         var single_container_width = single_container.clientWidth; //展现容器的宽
//         var single_scroll_width = single_container.scrollWidth;    //整个容器的宽，包括隐藏的
//         scroll_width = single_container_width * 1/3;               //滑动宽度定位展现容器的四分之一

//         should_scroll_pos = current_scroll_pos-scroll_width >= 0 ? current_scroll_pos-scroll_width:0;
// //        平滑的移动
//         move_ScrollBarLeft();
//     });
// //  右一页
//     var single_scrollbar_down = document.getElementById('single_scrollbar_down');
//     single_scrollbar_down.addEventListener("click",function(){

//         var single_container_width = single_container.clientWidth; //展现容器宽
//         var single_scroll_width = single_container.scrollWidth; //整个容器的宽度，包括隐藏的
//         scroll_width = single_container_width * 1/3; //滑动宽度定位展现容器的四分之一

//         should_scroll_pos = current_scroll_pos +scroll_width >= single_scroll_width-single_container_width ? single_scroll_width - single_container_width :current_scroll_pos +scroll_width;
// //        平滑的移动
//         move_ScrollBarRight();
//     });

    var moveTime = 50;
    var movePos = 20;

    function move_ScrollBarLeft(){
        current_scroll_pos -= movePos;
        if(current_scroll_pos > should_scroll_pos){
            setTimeout(move_ScrollBarLeft,moveTime);
            single_container.scrollLeft = current_scroll_pos;
        }else{
            current_scroll_pos = should_scroll_pos;
            single_container.scrollLeft = current_scroll_pos;
        }
    }

    function move_ScrollBarRight(){
        current_scroll_pos += movePos;
        if(current_scroll_pos < should_scroll_pos){
            single_container.scrollLeft = current_scroll_pos;
            setTimeout(move_ScrollBarRight,moveTime);
        }else{
            current_scroll_pos = should_scroll_pos;
            single_container.scrollLeft = current_scroll_pos;
        }
    }
}



var onPaint = function() {

    // Saving all the points in an array
    // points.push({x: mouse.x, y: mouse.y});

    if (points.length < 3) {

        var b = points[0];
        tmp_ctx.beginPath();
        //ctx.moveTo(b.x, b.y);
        //ctx.lineTo(b.x+50, b.y+50);
        tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
        tmp_ctx.fill();
        tmp_ctx.closePath();

        return;
    }

    // Tmp canvas is always cleared up before drawing.
    tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

    tmp_ctx.beginPath();
    tmp_ctx.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2;
        var d = (points[i].y + points[i + 1].y) / 2;

        tmp_ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }

    // For the last 2 points
    tmp_ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y
    );
    tmp_ctx.stroke();

    isDrawn = true;
};

function clear_canvas()
{
    var canvas = document.getElementById('trustCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.closePath();

    //clearRect bug on android 4.0+ , use this to clear canvas
    var w = canvas.width;
    var h = canvas.height;   // save old width/height
    canvas.width = canvas.height = 0;  //set width/height to zero
    canvas.width=w;
    canvas.height=h;   //restore old width/height

    calculatedSigWidth = 0;//reset output signature's dimensions
    calculatedSigHeight = 0;

    signTrack = "";
    signTrachPointCount = 0;
    firstPointTime = 0;

    points = [];
    minX = 9999, minY = 9999, maxX = 0, maxY = 0;
    imageDataTmp = null;
    isDrawn = false;
}

function sign_confirm()
{
    if(!isDrawn)
    {
        custom_alert("请手写签名","确认");
        return;
    }
    var canvas = document.getElementById('trustCanvas');
    var ctx = canvas.getContext('2d');

    var width = maxX-minX + paste_padding + paste_padding;
    var height = maxY-minY + paste_padding + paste_padding;


    imageDataTmp = ctx.getImageData(minX - paste_padding,minY - paste_padding,width + paste_padding,height + paste_padding);

    if(signResCallback)
    {
        var signData = getSigData();

        var canvas = document.getElementById('trustCanvas');


        signResCallback(signObjTmp.signIndex, signData[0].substr(22, signData[0].length),signData[1].substr(22, signData[1].length), signTrack, signTrachPointCount, canvas.width, canvas.height);
    }

    document.body.parentNode.style.overflow="scroll"; //显示且可用
}

function setSignResCallback(signObj, callback)
{
    signObjTmp = signObj;
    signResCallback = callback;
    setSigConfig();
}

//because canvas inits before revoking #setSignResCallback, so we need to re-config sign properties
function setSigConfig()
{
    var canvas = document.getElementById('trustCanvas');
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
    tmp_ctx.strokeStyle = signObjTmp?signObjTmp.penColor:'black'; //线条颜色
}

function setCanvasHeight(height)
{
    var canvas = document.getElementById('trustCanvas');
    if(height > 0)
    {
        canvas.height = height;
        if(tmp_canvas)
        {
            tmp_canvas.height = height;
        }
    }
}

function getSigData()
{
    var compressSignData = new Array;
    if(imageDataTmp)
    {


        var tmp_canvas = document.createElement('canvas');
        var ctx = tmp_canvas.getContext('2d');

        var scaleFactor = window.devicePixelRatio ? window.devicePixelRatio : 1;

        tmp_canvas.width = imageDataTmp.width / scaleFactor;

        tmp_canvas.height = imageDataTmp.height / scaleFactor;

        var scaleFactor2 = 1;

        var ptToPx = 2.5;//按手机设备dpi为240计算
        var signAreaWidth = signObjTmp.signAreaWidth * ptToPx;
        var signAreaHeight = signObjTmp.signAreaHeight  * ptToPx;

        if(signAreaWidth/signAreaHeight <= tmp_canvas.width / tmp_canvas.height)
        {
            if(signAreaWidth <= tmp_canvas.width)
            {
                scaleFactor2 = signAreaWidth / tmp_canvas.width;
            }
        }
        else
        {
            if(signAreaHeight <= tmp_canvas.height)
            {
                scaleFactor2 = signAreaHeight / tmp_canvas.height;
            }
        }

        tmp_canvas.width *= scaleFactor2;
        tmp_canvas.height *= scaleFactor2;

        calculatedSigWidth = tmp_canvas.width;
        calculatedSigHeight = tmp_canvas.height;
//alert("calculatedSigWidth=" + calculatedSigWidth + ",calculatedSigHeight=" + calculatedSigHeight);
        ctx.scale(1/scaleFactor * scaleFactor2, 1/scaleFactor * scaleFactor2);

        var data_canvas = document.createElement('canvas');
        data_canvas.width = imageDataTmp.width;

        data_canvas.height = imageDataTmp.height;

        data_canvas.getContext('2d').putImageData(imageDataTmp,0,0);

        ctx.drawImage(data_canvas,0,0);



        var scaleFactor3 = signObjTmp.signImgRatio;

        var scaleFactorOverAll = 1/scaleFactor * scaleFactor2 * scaleFactor3;
        /*    if(scaleFactor3 == 0 || scaleFactor2 * scaleFactor3/scaleFactor >=1){
         scaleFactor3 = 1/scaleFactor2 * scaleFactor;
         alert(scaleFactor3);
         }*/

        var tmp_canvas_soucre = document.createElement('canvas');
        var ctx_source = tmp_canvas_soucre.getContext('2d');

        if(scaleFactorOverAll < 1)
        {
            tmp_canvas_soucre.width = imageDataTmp.width * scaleFactorOverAll;
            tmp_canvas_soucre.height = imageDataTmp.height * scaleFactorOverAll;
            ctx_source.scale(scaleFactorOverAll, scaleFactorOverAll);

        }
        else
        {
            tmp_canvas_soucre.width = imageDataTmp.width;
            tmp_canvas_soucre.height = imageDataTmp.height;
        }


        var saveData_canvas = document.createElement('canvas');
        saveData_canvas.width = imageDataTmp.width;
        saveData_canvas.height = imageDataTmp.height;
        saveData_canvas.getContext('2d').putImageData(imageDataTmp,0,0);
        ctx_source.drawImage(saveData_canvas,0,0);

        compressSignData[0] = tmp_canvas_soucre.toDataURL();
        compressSignData[1] = tmp_canvas.toDataURL();

        return compressSignData;
    }
    return null;
}

function getRawSigHeight()
{
    if(imageDataTmp)
    {
        if(window.devicePixelRatio !== undefined)
        {
            return imageDataTmp.height / window.devicePixelRatio;
        }
        return imageDataTmp.height;
    }

    return 0;
}

function getRawSigWidth()
{
    if(imageDataTmp)
    {
        if(window.devicePixelRatio !== undefined)
        {
            return imageDataTmp.width / window.devicePixelRatio;
        }
        return imageDataTmp.width;
    }

    return 0;
}

function cancelSign()
{
    clear_canvas();

    var dlg = document.getElementById("dialog");
    dlg.style.display = 'none';

    document.body.scroll="yes";

    if(signResCallback)
    {
        signResCallback(signObjTmp.signIndex, null, null, 0);//TODO process imageDataTmp
    }

}

function setIsTrustInputDlgShown(isShown)
{
    isTrustInputDlgShown = isShown;
}

//////Tests


function testGetImageData()
{
    //GetReqData(getSigData());
    //alert(getSigWidth() + "," + getSigHeight());
}

function testEnc()
{
    /*RSA pubkey enc
     var pubN = "9d0eff07c47a27a898c18fc89fd25b21898885b5a97054e81684e22bf13cd8725e7ff03ba2f8c1ad8c998952a30a65ff61ecbdb042661b8813e7a936de3474a51eb8a05458f7b357d95bb4f55741380403c1148108dfab4399af45d351deebaabffff552c10c6cd1599bc87642d37af5d474138a37fb60cdb7dcb3dbb9872a29";

     var pubE = "10001";

     var enc = rsaPubkeyEnc(pubN, pubE, "abcd");
     */

    // alert(enc);

    // var res = document.getElementById('result');
    // res.value = enc;

    var enc = tripleDesEncrypt("abcdefg", '000102030405060708090a0b0c0d0e0f');

    var res = document.getElementById('result');
    res.value = enc;
}

function testEncAndDec(){

    var encKey = "133434";
    var message = "abdfdsafdasfcdef132432432432g你好吗,,,fdafdas";

    var enc= tripleDesEncrypt(message, encKey) + "";

    var dec= tripleDesDecrypt(enc, encKey) + "";
    var soucre_str =trust.hex.hexStrToUint8Str(dec);


    var result = message  + "\n";
    result += enc + "\n";
    result += soucre_str  + "\n";


    var jsonStr = "{\"Alg\":\"111\",\"Value\":\"2222\"}";
    var datagaga = trust.json.stringToObj(jsonStr);

    var res = document.getElementById('result');
    res.value = result;

}



function custom_alert(message, buttonText) {

    showMsgDialog(message);
}

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}


//used jquery implements
var JQuery_Capable =
{
    offset : function(obj)
    {
        // Support: IE<10
        // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
        var core_strundefined = typeof undefined;

        var docElem, win,
            box = { top: 0, left: 0 },
            elem = obj,
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        // Make sure it's not a disconnected DOM node
        /* if ( !jQuery.contains( docElem, elem ) ) {
         return box;
         }*/

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
            box = elem.getBoundingClientRect();
        }

        win = JQuery_Capable.getWindow( doc );

        return {
            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
    },

    getWindow : function( elem )
    {
        return JQuery_Capable.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    },

    isWindow : function( obj )
    {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    }
}

var isIe=(document.all)?true:false;
var messContent;

//设置select的可见状态
function setSelectState(state)
{
    var objl=document.getElementsByTagName('select');
    for(var i=0;i<objl.length;i++)
    {
        objl[i].style.visibility=state;
    }
}


function showMessageBox2(wTitle,content,pos,wWidth)
{
    closeWindow();
    /* var bWidth=parseInt(document.documentElement.scrollWidth);
     var bHeight=parseInt(document.documentElement.scrollHeight);*/

    /*var bHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
     var bWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;*/

    /*var bHeight = "innerHeight" in window
     ? window.innerHeight
     : document.documentElement.offsetHeight;

     var bWidth = "innerWidth" in window
     ? window.innerWidth
     : document.documentElement.offsetWidth;*/

    var bHeight = getWindowHeight();
    var bWidth = getWindowWidth();

    if(isIe){
        setSelectState('hidden');}
    var back=document.createElement("div");
    back.id="back";
    var styleStr="font-size:15pt; text-align:center; z-index:7;top:0px;left:0px;position:fixed;background:#666;width:"+bWidth+"px;height:"+bHeight+"px;";
    styleStr+=(isIe)?"filter:alpha(opacity=0);":"opacity:0;";
    back.style.cssText=styleStr;

    var mesW=document.createElement("div");
    mesW.id="mesWindow";
    mesW.innerHTML="<div id='mesWindowContent'>"+content+"</div><div id='mesWindowBottom'><input id='mesWindowBtnOk' type='button' onclick='closeWindow();'value='确认' /></div>";

//    styleStr="margin:" + bHeight*0.2 + " px" +" auto; width:" + bWidth*0.8 + " px" + ";";
//    styleStr="margin:" + bHeight*0.2 +" 0 0 0; width:100%;";
//    mesW.style.cssText=styleStr;

    back.appendChild(mesW);

    document.body.appendChild(back);
    showBackground(back,80);

    if('ontouchstart' in document.documentElement)
    {
        back.ontouchstart = function(e)
        {
            if(e.target.id !== 'mesWindowBtnOk')
            {
                preventDefault(e);
                return false;//important
            }

            return true;
        }

        back.ontouchmove = function(e)
        {
            preventDefault(e);
        }
    }
    else
    {
        back.onmousedown = function(e)
        {
            if(e.target.id !== 'mesWindowBtnOk')
            {
                preventDefault(e);
            }

        }

        back.onmousemove = function(e)
        {
            preventDefault(e);
        }
    }

    //document.body.appendChild(mesW);



}

//让背景渐渐变暗
function showBackground(obj,endInt)
{
    if(isIe)
    {
        obj.filters.alpha.opacity+=1;
        if(obj.filters.alpha.opacity<endInt)
        {
            setTimeout(function(){showBackground(obj,endInt)},5);
        }
    }else{
        var al=parseFloat(obj.style.opacity);al+=0.01;
        obj.style.opacity=al;
        if(al<(endInt/100))
        {setTimeout(function(){showBackground(obj,endInt)},5);}
    }
}

//关闭窗口
function closeWindow()
{
    if(document.getElementById('back')!=null)
    {
        document.getElementById('back').parentNode.removeChild(document.getElementById('back'));
    }
    if(document.getElementById('mesWindow')!=null)
    {
        document.getElementById('mesWindow').parentNode.removeChild(document.getElementById('mesWindow'));
    }
    if(isIe){
        setSelectState('');}
}

function showMsgDialog(msg)
{
//    messContent="<div style='padding:20px 0 20px 0;text-align:center; font-size: 10pt'>" + msg + "</div>";
    showMessageBox2('修改小结内容',msg,null,350);
}

function getWindowWidth()
{
    var winW = 630, winH = 460;
    if (document.body && document.body.offsetWidth) {
        winW = document.body.offsetWidth;
        winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
        winW = document.documentElement.offsetWidth;
        winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }

    return winW;
}

function getWindowHeight() {
    var winW = 630, winH = 460;
    if (document.body && document.body.offsetWidth) {
        winW = document.body.offsetWidth;
        winH = document.body.offsetHeight;
    }
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
        winW = document.documentElement.offsetWidth;
        winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }

    return winH;
}


