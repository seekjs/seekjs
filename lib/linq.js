<<<<<<< HEAD
/*csd*/
Enumerable = function () {
	var D = "Single:sequence contains more than one element.",
	v = true,
	s = null,
	r = false,
	t = function (b) {
		this.GetEnumerator = b;
	};
	t.Choice = function () {
		var b = arguments[0] instanceof Array ? arguments[0] : arguments;
		return new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(b[Math.floor(Math.random() * b.length)]);
			},
			x.Blank);
		});
	};
	t.Cycle = function () {
		var b = arguments[0] instanceof Array ? arguments[0] : arguments;
		return new t(function () {
			var a = 0;
			return new w(x.Blank,
			function () {
				if (a >= b.length) {
					a = 0;
				}
				return this.Yield(b[a++]);
			},
			x.Blank);
		});
	};
	t.Empty = function () {
		return new t(function () {
			return new w(x.Blank,
			function () {
				return r;
			},
			x.Blank);
		});
	};
	t.From = function (a) {
		if (a == s) {
			return t.Empty();
		}
		if (a instanceof t) {
			return a;
		}
		if (typeof a == z.Number || typeof a == z.Boolean) {
			return t.Repeat(a, 1);
		}
		if (typeof a == z.String) {
			return new t(function () {
				var c = 0;
				return new w(x.Blank,
				function () {
					return c < a.length ? this.Yield(a.charAt(c++)) : r;
				},
				x.Blank);
			});
		}
		if (typeof a != z.Function) {
			if (typeof a.length == z.Number) {
				return new y(a);
			}
			if (!(a instanceof Object) && u.IsIEnumerable(a)) {
				return new t(function () {
					var e = v,
					d;
					return new w(function () {
						d = new Enumerator(a);
					},
					function () {
						if (e) {
							e = r;
						} else {
							d.moveNext();
						}
						return d.atEnd() ? r : this.Yield(d.item());
					},
					x.Blank);
				});
			}
		}
		return new t(function () {
			var d = [],
			e = 0;
			return new w(function () {
				for (var b in a) {
					!(a[b] instanceof Function) && d.push({
						Key: b,
						Value: a[b]
					});
				}
			},
			function () {
				return e < d.length ? this.Yield(d[e++]) : r;
			},
			x.Blank);
		});
	},
	t.Return = function (b) {
		return t.Repeat(b, 1);
	};
	t.Matches = function (c, b, a) {
		if (a == s) {
			a = "";
		}
		if (b instanceof RegExp) {
			a += b.ignoreCase ? "i" : "";
			a += b.multiline ? "m" : "";
			b = b.source;
		}
		if (a.indexOf("g") === -1) {
			a += "g";
		}
		return new t(function () {
			var d;
			return new w(function () {
				d = new RegExp(b, a);
			},
			function () {
				var e = d.exec(c);
				return e ? this.Yield(e) : r;
			},
			x.Blank);
		});
	};
	t.Range = function (f, c, b) {
		if (b == s) {
			b = 1;
		}
		return t.ToInfinity(f, b).Take(c);
	};
	t.RangeDown = function (f, c, b) {
		if (b == s) {
			b = 1;
		}
		return t.ToNegativeInfinity(f, b).Take(c);
	};
	t.RangeTo = function (c, f, b) {
		if (b == s) {
			b = 1;
		}
		return c < f ? t.ToInfinity(c, b).TakeWhile(function (d) {
			return d <= f;
		}) : t.ToNegativeInfinity(c, b).TakeWhile(function (d) {
			return d >= f;
		});
	};
	t.Repeat = function (c, b) {
		return b != s ? t.Repeat(c).Take(b) : new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(c);
			},
			x.Blank);
		});
	};
	t.RepeatWithFinalize = function (b, c) {
		b = u.CreateLambda(b);
		c = u.CreateLambda(c);
		return new t(function () {
			var a;
			return new w(function () {
				a = b();
			},
			function () {
				return this.Yield(a);
			},
			function () {
				if (a != s) {
					c(a);
					a = s;
				}
			});
		});
	};
	t.Generate = function (b, c) {
		if (c != s) {
			return t.Generate(b).Take(c);
		}
		b = u.CreateLambda(b);
		return new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(b());
			},
			x.Blank);
		});
	};
	t.ToInfinity = function (c, b) {
		if (c == s) {
			c = 0;
		}
		if (b == s) {
			b = 1;
		}
		return new t(function () {
			var a;
			return new w(function () {
				a = c - b;
			},
			function () {
				return this.Yield(a += b);
			},
			x.Blank);
		});
	};
	t.ToNegativeInfinity = function (c, b) {
		if (c == s) {
			c = 0;
		}
		if (b == s) {
			b = 1;
		}
		return new t(function () {
			var a;
			return new w(function () {
				a = c + b;
			},
			function () {
				return this.Yield(a -= b);
			},
			x.Blank);
		});
	};
	t.Unfold = function (c, a) {
		a = u.CreateLambda(a);
		return new t(function () {
			var e = v,
			b;
			return new w(x.Blank,
			function () {
				if (e) {
					e = r;
					b = c;
					return this.Yield(b);
				}
				b = a(b);
				return this.Yield(b);
			},
			x.Blank);
		});
	};
	t.prototype = {
		CascadeBreadthFirst: function (c, a) {
			var d = this;
			c = u.CreateLambda(c);
			a = u.CreateLambda(a);
			return new t(function () {
				var b, f = 0,
				e = [];
				return new w(function () {
					b = d.GetEnumerator();
				},
				function () {
					while (v) {
						if (b.MoveNext()) {
							e.push(b.Current());
							return this.Yield(a(b.Current(), f));
						}
						var g = t.From(e).SelectMany(function (h) {
							return c(h);
						});
						if (!g.Any()) {
							return r;
						} else {
							f++;
							e = [];
							u.Dispose(b);
							b = g.GetEnumerator();
						}
					}
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		CascadeDepthFirst: function (c, a) {
			var d = this;
			c = u.CreateLambda(c);
			a = u.CreateLambda(a);
			return new t(function () {
				var e = [],
				b;
				return new w(function () {
					b = d.GetEnumerator();
				},
				function () {
					while (v) {
						if (b.MoveNext()) {
							var g = a(b.Current(), e.length);
							e.push(b);
							b = t.From(c(b.Current())).GetEnumerator();
							return this.Yield(g);
						}
						if (e.length <= 0) {
							return r;
						}
						u.Dispose(b);
						b = e.pop();
					}
				},
				function () {
					try {
						u.Dispose(b);
					} finally {
						t.From(e).ForEach(function (f) {
							f.Dispose();
						});
					}
				});
			});
		},
		Flatten: function () {
			var a = this;
			return new t(function () {
				var c, b = s;
				return new w(function () {
					c = a.GetEnumerator();
				},
				function () {
					while (v) {
						if (b != s) {
							if (b.MoveNext()) {
								return this.Yield(b.Current());
							} else {
								b = s;
							}
						}
						if (c.MoveNext()) {
							if (c.Current() instanceof Array) {
								u.Dispose(b);
								b = t.From(c.Current()).SelectMany(x.Identity).Flatten().GetEnumerator();
								continue;
							} else {
								return this.Yield(c.Current());
							}
						}
						return r;
					}
				},
				function () {
					try {
						u.Dispose(c);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Pairwise: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
					b.MoveNext();
				},
				function () {
					var e = b.Current();
					return b.MoveNext() ? this.Yield(a(e, b.Current())) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Scan: function (c, a, d) {
			if (d != s) {
				return this.Scan(c, a).Select(d);
			}
			var b;
			if (a == s) {
				a = u.CreateLambda(c);
				b = r;
			} else {
				a = u.CreateLambda(a);
				b = v;
			}
			var e = this;
			return new t(function () {
				var f, g, h = v;
				return new w(function () {
					f = e.GetEnumerator();
				},
				function () {
					if (h) {
						h = r;
						if (!b) {
							if (f.MoveNext()) {
								return this.Yield(g = f.Current());
							}
						} else {
							return this.Yield(g = c);
						}
					}
					return f.MoveNext() ? this.Yield(g = a(g, f.Current())) : r;
				},
				function () {
					u.Dispose(f);
				});
			});
		},
		Select: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(a(b.Current(), d++)) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SelectMany: function (b, a) {
			var c = this;
			b = u.CreateLambda(b);
			if (a == s) {
				a = function (e, d) {
					return d;
				};
			}
			a = u.CreateLambda(a);
			return new t(function () {
				var e, d = undefined,
				f = 0;
				return new w(function () {
					e = c.GetEnumerator();
				},
				function () {
					if (d === undefined) {
						if (!e.MoveNext()) {
							return r;
						}
					}
					do {
						if (d == s) {
							var g = b(e.Current(), f++);
							d = t.From(g).GetEnumerator();
						}
						if (d.MoveNext()) {
							return this.Yield(a(e.Current(), d.Current()));
						}
						u.Dispose(d);
						d = s;
					} while (e.MoveNext());
					return r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(d);
					}
				});
			});
		},
		Where: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					while (b.MoveNext()) {
						if (a(b.Current(), d++)) {
							return this.Yield(b.Current());
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		OfType: function (d) {
			var b;
			switch (d) {
				case Number:
					b = z.Number;
					break;
				case String:
					b = z.String;
					break;
				case Boolean:
					b = z.Boolean;
					break;
				case Function:
					b = z.Function;
					break;
				default:
					b = s;
			}
			return b === s ? this.Where(function (c) {
				return c instanceof d;
			}) : this.Where(function (a) {
				return typeof a === b;
			});
		},
		Zip: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var e, b, f = 0;
				return new w(function () {
					e = d.GetEnumerator();
					b = t.From(c).GetEnumerator();
				},
				function () {
					return e.MoveNext() && b.MoveNext() ? this.Yield(a(e.Current(), b.Current(), f++)) : r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Join: function (f, b, a, d, c) {
			b = u.CreateLambda(b);
			a = u.CreateLambda(a);
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			var e = this;
			return new t(function () {
				var g, j, h = s,
				i = 0;
				return new w(function () {
					g = e.GetEnumerator();
					j = t.From(f).ToLookup(a, x.Identity, c);
				},
				function () {
					while (v) {
						if (h != s) {
							var k = h[i++];
							if (k !== undefined) {
								return this.Yield(d(g.Current(), k));
							}
							k = s;
							i = 0;
						}
						if (g.MoveNext()) {
							var l = b(g.Current());
							h = j.Get(l).ToArray();
						} else {
							return r;
						}
					}
				},
				function () {
					u.Dispose(g);
				});
			});
		},
		GroupJoin: function (g, b, a, d, c) {
			b = u.CreateLambda(b);
			a = u.CreateLambda(a);
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			var f = this;
			return new t(function () {
				var e = f.GetEnumerator(),
				h = s;
				return new w(function () {
					e = f.GetEnumerator();
					h = t.From(g).ToLookup(a, x.Identity, c);
				},
				function () {
					if (e.MoveNext()) {
						var i = h.Get(b(e.Current()));
						return this.Yield(d(e.Current(), i));
					}
					return r;
				},
				function () {
					u.Dispose(e);
				});
			});
		},
		All: function (a) {
			a = u.CreateLambda(a);
			var d = v;
			this.ForEach(function (b) {
				if (!a(b)) {
					d = r;
					return r;
				}
			});
			return d;
		},
		Any: function (d) {
			d = u.CreateLambda(d);
			var a = this.GetEnumerator();
			try {
				if (arguments.length == 0) {
					return a.MoveNext();
				}
				while (a.MoveNext()) {
					if (d(a.Current())) {
						return v;
					}
				}
				return r;
			} finally {
				u.Dispose(a);
			}
		},
		Concat: function (a) {
			var b = this;
			return new t(function () {
				var d, c;
				return new w(function () {
					d = b.GetEnumerator();
				},
				function () {
					if (c == s) {
						if (d.MoveNext()) {
							return this.Yield(d.Current());
						}
						c = t.From(a).GetEnumerator();
					}
					return c.MoveNext() ? this.Yield(c.Current()) : r;
				},
				function () {
					try {
						u.Dispose(d);
					} finally {
						u.Dispose(c);
					}
				});
			});
		},
		Insert: function (d, a) {
			var c = this;
			return new t(function () {
				var e, b, g = 0,
				f = r;
				return new w(function () {
					e = c.GetEnumerator();
					b = t.From(a).GetEnumerator();
				},
				function () {
					if (g == d && b.MoveNext()) {
						f = v;
						return this.Yield(b.Current());
					}
					if (e.MoveNext()) {
						g++;
						return this.Yield(e.Current());
					}
					return !f && b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Alternate: function (b) {
			b = t.Return(b);
			return this.SelectMany(function (a) {
				return t.Return(a).Concat(b);
			}).TakeExceptLast();
		},
		Contains: function (e, a) {
			a = u.CreateLambda(a);
			var d = this.GetEnumerator();
			try {
				while (d.MoveNext()) {
					if (a(d.Current()) === e) {
						return v;
					}
				}
				return r;
			} finally {
				u.Dispose(d);
			}
		},
		DefaultIfEmpty: function (a) {
			var c = this;
			return new t(function () {
				var b, d = v;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					if (b.MoveNext()) {
						d = r;
						return this.Yield(b.Current());
					} else {
						if (d) {
							d = r;
							return this.Yield(a);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Distinct: function (b) {
			return this.Except(t.Empty(), b);
		},
		Except: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var b, e;
				return new w(function () {
					b = d.GetEnumerator();
					e = new E(a);
					t.From(c).ForEach(function (f) {
						e.Add(f);
					});
				},
				function () {
					while (b.MoveNext()) {
						var f = b.Current();
						if (!e.Contains(f)) {
							e.Add(f);
							return this.Yield(f);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Intersect: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var b, e, f;
				return new w(function () {
					b = d.GetEnumerator();
					e = new E(a);
					t.From(c).ForEach(function (g) {
						e.Add(g);
					});
					f = new E(a);
				},
				function () {
					while (b.MoveNext()) {
						var g = b.Current();
						if (!f.Contains(g) && e.Contains(g)) {
							f.Add(g);
							return this.Yield(g);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SequenceEqual: function (e, c) {
			c = u.CreateLambda(c);
			var d = this.GetEnumerator();
			try {
				var a = t.From(e).GetEnumerator();
				try {
					while (d.MoveNext()) {
						if (!a.MoveNext() || c(d.Current()) !== c(a.Current())) {
							return r;
						}
					}
					return a.MoveNext() ? r : v;
				} finally {
					u.Dispose(a);
				}
			} finally {
				u.Dispose(d);
			}
		},
		Union: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var f, b, e;
				return new w(function () {
					f = d.GetEnumerator();
					e = new E(a);
				},
				function () {
					var g;
					if (b === undefined) {
						while (f.MoveNext()) {
							g = f.Current();
							if (!e.Contains(g)) {
								e.Add(g);
								return this.Yield(g);
							}
						}
						b = t.From(c).GetEnumerator();
					}
					while (b.MoveNext()) {
						g = b.Current();
						if (!e.Contains(g)) {
							e.Add(g);
							return this.Yield(g);
						}
					}
					return r;
				},
				function () {
					try {
						u.Dispose(f);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		OrderBy: function (a) {
			return new A(this, a, r);
		},
		OrderByDescending: function (b) {
			return new A(this, b, v);
		},
		Reverse: function () {
			var a = this;
			return new t(function () {
				var b, e;
				return new w(function () {
					b = a.ToArray();
					e = b.length;
				},
				function () {
					return e > 0 ? this.Yield(b[--e]) : r;
				},
				x.Blank);
			});
		},
		Shuffle: function () {
			var a = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = a.ToArray();
				},
				function () {
					if (b.length > 0) {
						var c = Math.floor(Math.random() * b.length);
						return this.Yield(b.splice(c, 1)[0]);
					}
					return r;
				},
				x.Blank);
			});
		},
		GroupBy: function (d, c, a, b) {
			var f = this;
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			if (a != s) {
				a = u.CreateLambda(a);
			}
			b = u.CreateLambda(b);
			return new t(function () {
				var e;
				return new w(function () {
					e = f.ToLookup(d, c, b).ToEnumerable().GetEnumerator();
				},
				function () {
					while (e.MoveNext()) {
						return a == s ? this.Yield(e.Current()) : this.Yield(a(e.Current().Key(), e.Current()));
					}
					return r;
				},
				function () {
					u.Dispose(e);
				});
			});
		},
		PartitionBy: function (d, c, a, b) {
			var f = this;
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			b = u.CreateLambda(b);
			var e;
			if (a == s) {
				e = r;
				a = function (h, g) {
					return new F(h, g);
				};
			} else {
				e = v;
				a = u.CreateLambda(a);
			}
			return new t(function () {
				var g, i, j, h = [];
				return new w(function () {
					g = f.GetEnumerator();
					if (g.MoveNext()) {
						i = d(g.Current());
						j = b(i);
						h.push(c(g.Current()));
					}
				},
				function () {
					var k;
					while ((k = g.MoveNext()) == v) {
						if (j === b(d(g.Current()))) {
							h.push(c(g.Current()));
						} else {
							break;
						}
					}
					if (h.length > 0) {
						var l = e ? a(i, t.From(h)) : a(i, h);
						if (k) {
							i = d(g.Current());
							j = b(i);
							h = [c(g.Current())];
						} else {
							h = [];
						}
						return this.Yield(l);
					}
					return r;
				},
				function () {
					u.Dispose(g);
				});
			});
		},
		BufferWithCount: function (c) {
			var a = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = a.GetEnumerator();
				},
				function () {
					var e = [],
					f = 0;
					while (b.MoveNext()) {
						e.push(b.Current());
						if (++f >= c) {
							return this.Yield(e);
						}
					}
					return e.length > 0 ? this.Yield(e) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Aggregate: function (f, e, d) {
			return this.Scan(f, e, d).Last();
		},
		Average: function (d) {
			d = u.CreateLambda(d);
			var f = 0,
			e = 0;
			this.ForEach(function (a) {
				f += d(a); ++e;
			});
			return f / e;
		},
		Count: function (b) {
			b = b == s ? x.True : u.CreateLambda(b);
			var d = 0;
			this.ForEach(function (c, a) {
				if (b(c, a)) {
					++d;
				}
			});
			return d;
		},
		Max: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(function (c, d) {
				return c > d ? c : d;
			});
		},
		Min: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(function (c, d) {
				return c < d ? c : d;
			});
		},
		MaxBy: function (b) {
			b = u.CreateLambda(b);
			return this.Aggregate(function (a, d) {
				return b(a) > b(d) ? a : d;
			});
		},
		MinBy: function (b) {
			b = u.CreateLambda(b);
			return this.Aggregate(function (a, d) {
				return b(a) < b(d) ? a : d;
			});
		},
		Sum: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(0,
			function (c, d) {
				return c + d;
			});
		},
		ElementAt: function (f) {
			var e, a = r;
			this.ForEach(function (c, b) {
				if (b == f) {
					e = c;
					a = v;
					return r;
				}
			});
			if (!a) {
				throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
			}
			return e;
		},
		ElementAtOrDefault: function (h, g) {
			var e, a = r;
			this.ForEach(function (c, b) {
				if (b == h) {
					e = c;
					a = v;
					return r;
				}
			});
			return !a ? g : e;
		},
		First: function (a) {
			if (a != s) {
				return this.Where(a).First();
			}
			var e, b = r;
			this.ForEach(function (c) {
				e = c;
				b = v;
				return r;
			});
			if (!b) {
				throw new Error("First:No element satisfies the condition.");
			}
			return e;
		},
		FirstOrDefault: function (a, b) {
			if (b != s) {
				return this.Where(b).FirstOrDefault(a);
			}
			var h, e = r;
			this.ForEach(function (c) {
				h = c;
				e = v;
				return r;
			});
			return !e ? a : h;
		},
		Last: function (a) {
			if (a != s) {
				return this.Where(a).Last();
			}
			var e, b = r;
			this.ForEach(function (c) {
				b = v;
				e = c;
			});
			if (!b) {
				throw new Error("Last:No element satisfies the condition.");
			}
			return e;
		},
		LastOrDefault: function (a, b) {
			if (b != s) {
				return this.Where(b).LastOrDefault(a);
			}
			var h, e = r;
			this.ForEach(function (c) {
				e = v;
				h = c;
			});
			return !e ? a : h;
		},
		Single: function (b) {
			if (b != s) {
				return this.Where(b).Single();
			}
			var e, a = r;
			this.ForEach(function (c) {
				if (!a) {
					a = v;
					e = c;
				} else {
					throw new Error(D);
				}
			});
			if (!a) {
				throw new Error("Single:No element satisfies the condition.");
			}
			return e;
		},
		SingleOrDefault: function (b, e) {
			if (e != s) {
				return this.Where(e).SingleOrDefault(b);
			}
			var h, a = r;
			this.ForEach(function (c) {
				if (!a) {
					a = v;
					h = c;
				} else {
					throw new Error(D);
				}
			});
			return !a ? b : h;
		},
		Skip: function (c) {
			var a = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = a.GetEnumerator();
					while (d++ < c && b.MoveNext()) { }
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SkipWhile: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, e = 0,
				d = r;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					while (!d) {
						if (b.MoveNext()) {
							if (!a(b.Current(), e++)) {
								d = v;
								return this.Yield(b.Current());
							}
							continue;
						} else {
							return r;
						}
					}
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Take: function (c) {
			var a = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = a.GetEnumerator();
				},
				function () {
					return d++ < c && b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		TakeWhile: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() && a(b.Current(), d++) ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		TakeExceptLast: function (a) {
			if (a == s) {
				a = 1;
			}
			var b = this;
			return new t(function () {
				if (a <= 0) {
					return b.GetEnumerator();
				}
				var d, e = [];
				return new w(function () {
					d = b.GetEnumerator();
				},
				function () {
					while (d.MoveNext()) {
						if (e.length == a) {
							e.push(d.Current());
							return this.Yield(e.shift());
						}
						e.push(d.Current());
					}
					return r;
				},
				function () {
					u.Dispose(d);
				});
			});
		},
		TakeFromLast: function (a) {
			if (a <= 0 || a == s) {
				return t.Empty();
			}
			var b = this;
			return new t(function () {
				var e, c, d = [];
				return new w(function () {
					e = b.GetEnumerator();
				},
				function () {
					while (e.MoveNext()) {
						d.length == a && d.shift();
						d.push(e.Current());
					}
					if (c == s) {
						c = t.From(d).GetEnumerator();
					}
					return c.MoveNext() ? this.Yield(c.Current()) : r;
				},
				function () {
					u.Dispose(c);
				});
			});
		},
		IndexOf: function (d) {
			var b = s;
			this.ForEach(function (c, a) {
				if (c === d) {
					b = a;
					return v;
				}
			});
			return b !== s ? b : -1;
		},
		LastIndexOf: function (d) {
			var c = -1;
			this.ForEach(function (b, a) {
				if (b === d) {
					c = a;
				}
			});
			return c;
		},
		ToArray: function () {
			var b = [];
			this.ForEach(function (a) {
				b.push(a);
			});
			return b;
		},
		ToLookup: function (g, f, d) {
			g = u.CreateLambda(g);
			f = u.CreateLambda(f);
			d = u.CreateLambda(d);
			var h = new E(d);
			this.ForEach(function (i) {
				var e = g(i),
				b = f(i),
				c = h.Get(e);
				if (c !== undefined) {
					c.push(b);
				} else {
					h.Add(e, [b]);
				}
			});
			return new H(h);
		},
		ToObject: function (e, d) {
			e = u.CreateLambda(e);
			d = u.CreateLambda(d);
			var f = {};
			this.ForEach(function (a) {
				f[e(a)] = d(a);
			});
			return f;
		},
		ToDictionary: function (g, f, d) {
			g = u.CreateLambda(g);
			f = u.CreateLambda(f);
			d = u.CreateLambda(d);
			var h = new E(d);
			this.ForEach(function (b) {
				h.Add(g(b), f(b));
			});
			return h;
		},
		ToJSON: function (c, d) {
			return JSON.stringify(this.ToArray(), c, d);
		},
		ToString: function (b, d) {
			if (b == s) {
				b = "";
			}
			if (d == s) {
				d = x.Identity;
			}
			return this.Select(d).ToArray().join(b);
		},
		Do: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					if (b.MoveNext()) {
						a(b.Current(), d++);
						return this.Yield(b.Current());
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		ForEach: function (d) {
			d = u.CreateLambda(d);
			var f = 0,
			a = this.GetEnumerator();
			try {
				while (a.MoveNext()) {
					if (d(a.Current(), f++) === r) {
						break;
					}
				}
			} finally {
				u.Dispose(a);
			}
		},
		Write: function (a, b) {
			if (a == s) {
				a = "";
			}
			b = u.CreateLambda(b);
			var d = v;
			this.ForEach(function (c) {
				if (d) {
					d = r;
				} else {
					document.write(a);
				}
				document.write(b(c));
			});
		},
		WriteLine: function (b) {
			b = u.CreateLambda(b);
			this.ForEach(function (a) {
				document.write(b(a));
				document.write("<br />");
			});
		},
		Force: function () {
			var b = this.GetEnumerator();
			try {
				while (b.MoveNext()) { }
			} finally {
				u.Dispose(b);
			}
		},
		Let: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = t.From(a(c)).GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Share: function () {
			var b = this,
			a;
			return new t(function () {
				return new w(function () {
					if (a == s) {
						a = b.GetEnumerator();
					}
				},
				function () {
					return a.MoveNext() ? this.Yield(a.Current()) : r;
				},
				x.Blank);
			});
		},
		MemoizeAll: function () {
			var c = this,
			b, a;
			return new t(function () {
				var d = -1;
				return new w(function () {
					if (a == s) {
						a = c.GetEnumerator();
						b = [];
					}
				},
				function () {
					d++;
					return b.length <= d ? a.MoveNext() ? this.Yield(b[d] = a.Current()) : r : this.Yield(b[d]);
				},
				x.Blank);
			});
		},
		Catch: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					try {
						return b.MoveNext() ? this.Yield(b.Current()) : r;
					} catch (e) {
						a(e);
						return r;
					}
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Finally: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					try {
						u.Dispose(b);
					} finally {
						a();
					}
				});
			});
		},
		Trace: function (d, b) {
			if (d == s) {
				d = "Trace";
			}
			b = u.CreateLambda(b);
			return this.Do(function (a) {
				console.log(d, ":", b(a));
			});
		}
	};
	var x = {
		Identity: function (b) {
			return b;
		},
		True: function () {
			return v;
		},
		Blank: function () { }
	},
	z = {
		Boolean: typeof v,
		Number: typeof 0,
		String: typeof "",
		Object: typeof {},
		Undefined: typeof undefined,
		Function: typeof
		function () { }
	},
	u = {
		CreateLambda: function (b) {
			if (b == s) {
				return x.Identity;
			}
			if (typeof b == z.String) {
				if (b == "") {
					return x.Identity;
				} else {
					if (b.indexOf("=>") == -1) {
						return new Function("$,$$,$$$,$$$$", "return " + b);
					} else {
						var d = b.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
						return new Function(d[1], "return " + d[2]);
					}
				}
			}
			return b;
		},
		IsIEnumerable: function (a) {
			if (typeof Enumerator != z.Undefined) {
				try {
					new Enumerator(a);
					return v;
				} catch (d) { }
			}
			return r;
		},
		Compare: function (c, d) {
			return c === d ? 0 : c > d ? 1 : -1;
		},
		Dispose: function (b) {
			b != s && b.Dispose();
		}
	},
	B = {
		Before: 0,
		Running: 1,
		After: 2
	},
	w = function (h, i, j) {
		var e = new G,
		a = B.Before;
		this.Current = e.Current;
		this.MoveNext = function () {
			try {
				switch (a) {
					case B.Before:
						a = B.Running;
						h();
					case B.Running:
						if (i.apply(e)) {
							return v;
						} else {
							this.Dispose();
							return r;
						}
					case B.After:
						return r;
				}
			} catch (b) {
				this.Dispose();
				throw b;
			}
		};
		this.Dispose = function () {
			if (a != B.Running) {
				return;
			}
			try {
				j();
			} finally {
				a = B.After;
			}
		};
	},
	G = function () {
		var b = s;
		this.Current = function () {
			return b;
		};
		this.Yield = function (a) {
			b = a;
			return v;
		};
	},
	A = function (j, g, h, i) {
		var d = this;
		d.source = j;
		d.keySelector = u.CreateLambda(g);
		d.descending = h;
		d.parent = i;
	};
	A.prototype = new t;
	A.prototype.CreateOrderedEnumerable = function (c, d) {
		return new A(this.source, c, d, this);
	};
	A.prototype.ThenBy = function (a) {
		return this.CreateOrderedEnumerable(a, r);
	};
	A.prototype.ThenByDescending = function (b) {
		return this.CreateOrderedEnumerable(b, v);
	};
	A.prototype.GetEnumerator = function () {
		var g = this,
		b, a, f = 0;
		return new w(function () {
			b = [];
			a = [];
			g.source.ForEach(function (e, d) {
				b.push(e);
				a.push(d);
			});
			var c = C.Create(g, s);
			c.GenerateKeys(b);
			a.sort(function (d, e) {
				return c.Compare(d, e);
			});
		},
		function () {
			return f < a.length ? this.Yield(b[a[f++]]) : r;
		},
		x.Blank);
	};
	var C = function (f, g, h) {
		var b = this;
		b.keySelector = f;
		b.descending = g;
		b.child = h;
		b.keys = s;
	};
	C.Create = function (b, f) {
		var e = new C(b.keySelector, b.descending, f);
		return b.parent != s ? C.Create(b.parent, e) : e;
	};
	C.prototype.GenerateKeys = function (i) {
		var b = this;
		for (var k = i.length,
		l = b.keySelector,
		j = new Array(k), h = 0; h < k; h++) {
			j[h] = l(i[h]);
		}
		b.keys = j;
		b.child != s && b.child.GenerateKeys(i);
	};
	C.prototype.Compare = function (g, h) {
		var b = this,
		d = u.Compare(b.keys[g], b.keys[h]);
		if (d == 0) {
			if (b.child != s) {
				return b.child.Compare(g, h);
			}
			d = u.Compare(g, h);
		}
		return b.descending ? -d : d;
	};
	var y = function (b) {
		this.source = b;
	};
	y.prototype = new t;
	y.prototype.Any = function (b) {
		return b == s ? this.source.length > 0 : t.prototype.Any.apply(this, arguments);
	};
	y.prototype.Count = function (b) {
		return b == s ? this.source.length : t.prototype.Count.apply(this, arguments);
	};
	y.prototype.ElementAt = function (b) {
		return 0 <= b && b < this.source.length ? this.source[b] : t.prototype.ElementAt.apply(this, arguments);
	};
	y.prototype.ElementAtOrDefault = function (c, d) {
		return 0 <= c && c < this.source.length ? this.source[c] : d;
	};
	y.prototype.First = function (b) {
		return b == s && this.source.length > 0 ? this.source[0] : t.prototype.First.apply(this, arguments);
	};
	y.prototype.FirstOrDefault = function (b, c) {
		return c != s ? t.prototype.FirstOrDefault.apply(this, arguments) : this.source.length > 0 ? this.source[0] : b;
	};
	y.prototype.Last = function (c) {
		var b = this;
		return c == s && b.source.length > 0 ? b.source[b.source.length - 1] : t.prototype.Last.apply(b, arguments);
	};
	y.prototype.LastOrDefault = function (c, f) {
		var b = this;
		return f != s ? t.prototype.LastOrDefault.apply(b, arguments) : b.source.length > 0 ? b.source[b.source.length - 1] : c;
	};
	y.prototype.Skip = function (c) {
		var a = this.source;
		return new t(function () {
			var b;
			return new w(function () {
				b = c < 0 ? 0 : c;
			},
			function () {
				return b < a.length ? this.Yield(a[b++]) : r;
			},
			x.Blank);
		});
	};
	y.prototype.TakeExceptLast = function (b) {
		if (b == s) {
			b = 1;
		}
		return this.Take(this.source.length - b);
	};
	y.prototype.TakeFromLast = function (b) {
		return this.Skip(this.source.length - b);
	};
	y.prototype.Reverse = function () {
		var a = this.source;
		return new t(function () {
			var b;
			return new w(function () {
				b = a.length;
			},
			function () {
				return b > 0 ? this.Yield(a[--b]) : r;
			},
			x.Blank);
		});
	};
	y.prototype.SequenceEqual = function (a, b) {
		return (a instanceof y || a instanceof Array) && b == s && t.From(a).Count() != this.Count() ? r : t.prototype.SequenceEqual.apply(this, arguments);
	};
	y.prototype.ToString = function (b, c) {
		if (c != s || !(this.source instanceof Array)) {
			return t.prototype.ToString.apply(this, arguments);
		}
		if (b == s) {
			b = "";
		}
		return this.source.join(b);
	};
	y.prototype.GetEnumerator = function () {
		var a = this.source,
		d = 0;
		return new w(x.Blank,
		function () {
			return d < a.length ? this.Yield(a[d++]) : r;
		},
		x.Blank);
	};
	var E = function () {
		var b = function (d, g) {
			return Object.prototype.hasOwnProperty.call(d, g);
		},
		a = function (d) {
			return d === s ? "null" : d === undefined ? "undefined" : typeof d.toString === z.Function ? d.toString() : Object.prototype.toString.call(d);
		},
		f = function (i, h) {
			var g = this;
			g.Key = i;
			g.Value = h;
			g.Prev = s;
			g.Next = s;
		},
		c = function () {
			this.First = s;
			this.Last = s;
		};
		c.prototype = {
			AddLast: function (g) {
				var d = this;
				if (d.Last != s) {
					d.Last.Next = g;
					g.Prev = d.Last;
					d.Last = g;
				} else {
					d.First = d.Last = g;
				}
			},
			Replace: function (g, d) {
				if (g.Prev != s) {
					g.Prev.Next = d;
					d.Prev = g.Prev;
				} else {
					this.First = d;
				}
				if (g.Next != s) {
					g.Next.Prev = d;
					d.Next = g.Next;
				} else {
					this.Last = d;
				}
			},
			Remove: function (d) {
				if (d.Prev != s) {
					d.Prev.Next = d.Next;
				} else {
					this.First = d.Next;
				}
				if (d.Next != s) {
					d.Next.Prev = d.Prev;
				} else {
					this.Last = d.Prev;
				}
			}
		};
		var e = function (g) {
			var d = this;
			d.count = 0;
			d.entryList = new c;
			d.buckets = {};
			d.compareSelector = g == s ? x.Identity : g;
		};
		e.prototype = {
			Add: function (o, p) {
				var d = this,
				n = d.compareSelector(o),
				m = a(n),
				k = new f(o, p);
				if (b(d.buckets, m)) {
					for (var h = d.buckets[m], l = 0; l < h.length; l++) {
						if (d.compareSelector(h[l].Key) === n) {
							d.entryList.Replace(h[l], k);
							h[l] = k;
							return;
						}
					}
					h.push(k);
				} else {
					d.buckets[m] = [k];
				}
				d.count++;
				d.entryList.AddLast(k);
			},
			Get: function (n) {
				var d = this,
				j = d.compareSelector(n),
				m = a(j);
				if (!b(d.buckets, m)) {
					return undefined;
				}
				for (var k = d.buckets[m], h = 0; h < k.length; h++) {
					var l = k[h];
					if (d.compareSelector(l.Key) === j) {
						return l.Value;
					}
				}
				return undefined;
			},
			Set: function (q, I) {
				var d = this,
				n = d.compareSelector(q),
				p = a(n);
				if (b(d.buckets, p)) {
					for (var l = d.buckets[p], h = 0; h < l.length; h++) {
						if (d.compareSelector(l[h].Key) === n) {
							var o = new f(q, I);
							d.entryList.Replace(l[h], o);
							l[h] = o;
							return v;
						}
					}
				}
				return r;
			},
			Contains: function (n) {
				var d = this,
				k = d.compareSelector(n),
				m = a(k);
				if (!b(d.buckets, m)) {
					return r;
				}
				for (var l = d.buckets[m], h = 0; h < l.length; h++) {
					if (d.compareSelector(l[h].Key) === k) {
						return v;
					}
				}
				return r;
			},
			Clear: function () {
				this.count = 0;
				this.buckets = {};
				this.entryList = new c;
			},
			Remove: function (l) {
				var d = this,
				k = d.compareSelector(l),
				j = a(k);
				if (!b(d.buckets, j)) {
					return;
				}
				for (var h = d.buckets[j], i = 0; i < h.length; i++) {
					if (d.compareSelector(h[i].Key) === k) {
						d.entryList.Remove(h[i]);
						h.splice(i, 1);
						if (h.length == 0) {
							delete d.buckets[j];
						}
						d.count--;
						return;
					}
				}
			},
			Count: function () {
				return this.count;
			},
			ToEnumerable: function () {
				var g = this;
				return new t(function () {
					var d;
					return new w(function () {
						d = g.entryList.First;
					},
					function () {
						if (d != s) {
							var h = {
								Key: d.Key,
								Value: d.Value
							};
							d = d.Next;
							return this.Yield(h);
						}
						return r;
					},
					x.Blank);
				});
			}
		};
		return e;
	}(),
	H = function (c) {
		var d = this;
		d.Count = function () {
			return c.Count();
		};
		d.Get = function (a) {
			return t.From(c.Get(a));
		};
		d.Contains = function (a) {
			return c.Contains(a);
		};
		d.ToEnumerable = function () {
			return c.ToEnumerable().Select(function (b) {
				return new F(b.Key, b.Value);
			});
		};
	},
	F = function (d, c) {
		this.Key = function () {
			return d;
		};
		y.call(this, c);
	};
	F.prototype = new y;
	return t;
}();
if (typeof define === "function" && define.cmd) {
	define(function (require, exports,module) {
		module.exports = Enumerable;
	});
=======
/*csd*/
Enumerable = function () {
	var D = "Single:sequence contains more than one element.",
	v = true,
	s = null,
	r = false,
	t = function (b) {
		this.GetEnumerator = b;
	};
	t.Choice = function () {
		var b = arguments[0] instanceof Array ? arguments[0] : arguments;
		return new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(b[Math.floor(Math.random() * b.length)]);
			},
			x.Blank);
		});
	};
	t.Cycle = function () {
		var b = arguments[0] instanceof Array ? arguments[0] : arguments;
		return new t(function () {
			var a = 0;
			return new w(x.Blank,
			function () {
				if (a >= b.length) {
					a = 0;
				}
				return this.Yield(b[a++]);
			},
			x.Blank);
		});
	};
	t.Empty = function () {
		return new t(function () {
			return new w(x.Blank,
			function () {
				return r;
			},
			x.Blank);
		});
	};
	t.From = function (a) {
		if (a == s) {
			return t.Empty();
		}
		if (a instanceof t) {
			return a;
		}
		if (typeof a == z.Number || typeof a == z.Boolean) {
			return t.Repeat(a, 1);
		}
		if (typeof a == z.String) {
			return new t(function () {
				var c = 0;
				return new w(x.Blank,
				function () {
					return c < a.length ? this.Yield(a.charAt(c++)) : r;
				},
				x.Blank);
			});
		}
		if (typeof a != z.Function) {
			if (typeof a.length == z.Number) {
				return new y(a);
			}
			if (!(a instanceof Object) && u.IsIEnumerable(a)) {
				return new t(function () {
					var e = v,
					d;
					return new w(function () {
						d = new Enumerator(a);
					},
					function () {
						if (e) {
							e = r;
						} else {
							d.moveNext();
						}
						return d.atEnd() ? r : this.Yield(d.item());
					},
					x.Blank);
				});
			}
		}
		return new t(function () {
			var d = [],
			e = 0;
			return new w(function () {
				for (var b in a) {
					!(a[b] instanceof Function) && d.push({
						Key: b,
						Value: a[b]
					});
				}
			},
			function () {
				return e < d.length ? this.Yield(d[e++]) : r;
			},
			x.Blank);
		});
	},
	t.Return = function (b) {
		return t.Repeat(b, 1);
	};
	t.Matches = function (c, b, a) {
		if (a == s) {
			a = "";
		}
		if (b instanceof RegExp) {
			a += b.ignoreCase ? "i" : "";
			a += b.multiline ? "m" : "";
			b = b.source;
		}
		if (a.indexOf("g") === -1) {
			a += "g";
		}
		return new t(function () {
			var d;
			return new w(function () {
				d = new RegExp(b, a);
			},
			function () {
				var e = d.exec(c);
				return e ? this.Yield(e) : r;
			},
			x.Blank);
		});
	};
	t.Range = function (f, c, b) {
		if (b == s) {
			b = 1;
		}
		return t.ToInfinity(f, b).Take(c);
	};
	t.RangeDown = function (f, c, b) {
		if (b == s) {
			b = 1;
		}
		return t.ToNegativeInfinity(f, b).Take(c);
	};
	t.RangeTo = function (c, f, b) {
		if (b == s) {
			b = 1;
		}
		return c < f ? t.ToInfinity(c, b).TakeWhile(function (d) {
			return d <= f;
		}) : t.ToNegativeInfinity(c, b).TakeWhile(function (d) {
			return d >= f;
		});
	};
	t.Repeat = function (c, b) {
		return b != s ? t.Repeat(c).Take(b) : new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(c);
			},
			x.Blank);
		});
	};
	t.RepeatWithFinalize = function (b, c) {
		b = u.CreateLambda(b);
		c = u.CreateLambda(c);
		return new t(function () {
			var a;
			return new w(function () {
				a = b();
			},
			function () {
				return this.Yield(a);
			},
			function () {
				if (a != s) {
					c(a);
					a = s;
				}
			});
		});
	};
	t.Generate = function (b, c) {
		if (c != s) {
			return t.Generate(b).Take(c);
		}
		b = u.CreateLambda(b);
		return new t(function () {
			return new w(x.Blank,
			function () {
				return this.Yield(b());
			},
			x.Blank);
		});
	};
	t.ToInfinity = function (c, b) {
		if (c == s) {
			c = 0;
		}
		if (b == s) {
			b = 1;
		}
		return new t(function () {
			var a;
			return new w(function () {
				a = c - b;
			},
			function () {
				return this.Yield(a += b);
			},
			x.Blank);
		});
	};
	t.ToNegativeInfinity = function (c, b) {
		if (c == s) {
			c = 0;
		}
		if (b == s) {
			b = 1;
		}
		return new t(function () {
			var a;
			return new w(function () {
				a = c + b;
			},
			function () {
				return this.Yield(a -= b);
			},
			x.Blank);
		});
	};
	t.Unfold = function (c, a) {
		a = u.CreateLambda(a);
		return new t(function () {
			var e = v,
			b;
			return new w(x.Blank,
			function () {
				if (e) {
					e = r;
					b = c;
					return this.Yield(b);
				}
				b = a(b);
				return this.Yield(b);
			},
			x.Blank);
		});
	};
	t.prototype = {
		CascadeBreadthFirst: function (c, a) {
			var d = this;
			c = u.CreateLambda(c);
			a = u.CreateLambda(a);
			return new t(function () {
				var b, f = 0,
				e = [];
				return new w(function () {
					b = d.GetEnumerator();
				},
				function () {
					while (v) {
						if (b.MoveNext()) {
							e.push(b.Current());
							return this.Yield(a(b.Current(), f));
						}
						var g = t.From(e).SelectMany(function (h) {
							return c(h);
						});
						if (!g.Any()) {
							return r;
						} else {
							f++;
							e = [];
							u.Dispose(b);
							b = g.GetEnumerator();
						}
					}
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		CascadeDepthFirst: function (c, a) {
			var d = this;
			c = u.CreateLambda(c);
			a = u.CreateLambda(a);
			return new t(function () {
				var e = [],
				b;
				return new w(function () {
					b = d.GetEnumerator();
				},
				function () {
					while (v) {
						if (b.MoveNext()) {
							var g = a(b.Current(), e.length);
							e.push(b);
							b = t.From(c(b.Current())).GetEnumerator();
							return this.Yield(g);
						}
						if (e.length <= 0) {
							return r;
						}
						u.Dispose(b);
						b = e.pop();
					}
				},
				function () {
					try {
						u.Dispose(b);
					} finally {
						t.From(e).ForEach(function (f) {
							f.Dispose();
						});
					}
				});
			});
		},
		Flatten: function () {
			var a = this;
			return new t(function () {
				var c, b = s;
				return new w(function () {
					c = a.GetEnumerator();
				},
				function () {
					while (v) {
						if (b != s) {
							if (b.MoveNext()) {
								return this.Yield(b.Current());
							} else {
								b = s;
							}
						}
						if (c.MoveNext()) {
							if (c.Current() instanceof Array) {
								u.Dispose(b);
								b = t.From(c.Current()).SelectMany(x.Identity).Flatten().GetEnumerator();
								continue;
							} else {
								return this.Yield(c.Current());
							}
						}
						return r;
					}
				},
				function () {
					try {
						u.Dispose(c);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Pairwise: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
					b.MoveNext();
				},
				function () {
					var e = b.Current();
					return b.MoveNext() ? this.Yield(a(e, b.Current())) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Scan: function (c, a, d) {
			if (d != s) {
				return this.Scan(c, a).Select(d);
			}
			var b;
			if (a == s) {
				a = u.CreateLambda(c);
				b = r;
			} else {
				a = u.CreateLambda(a);
				b = v;
			}
			var e = this;
			return new t(function () {
				var f, g, h = v;
				return new w(function () {
					f = e.GetEnumerator();
				},
				function () {
					if (h) {
						h = r;
						if (!b) {
							if (f.MoveNext()) {
								return this.Yield(g = f.Current());
							}
						} else {
							return this.Yield(g = c);
						}
					}
					return f.MoveNext() ? this.Yield(g = a(g, f.Current())) : r;
				},
				function () {
					u.Dispose(f);
				});
			});
		},
		Select: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(a(b.Current(), d++)) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SelectMany: function (b, a) {
			var c = this;
			b = u.CreateLambda(b);
			if (a == s) {
				a = function (e, d) {
					return d;
				};
			}
			a = u.CreateLambda(a);
			return new t(function () {
				var e, d = undefined,
				f = 0;
				return new w(function () {
					e = c.GetEnumerator();
				},
				function () {
					if (d === undefined) {
						if (!e.MoveNext()) {
							return r;
						}
					}
					do {
						if (d == s) {
							var g = b(e.Current(), f++);
							d = t.From(g).GetEnumerator();
						}
						if (d.MoveNext()) {
							return this.Yield(a(e.Current(), d.Current()));
						}
						u.Dispose(d);
						d = s;
					} while (e.MoveNext());
					return r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(d);
					}
				});
			});
		},
		Where: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					while (b.MoveNext()) {
						if (a(b.Current(), d++)) {
							return this.Yield(b.Current());
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		OfType: function (d) {
			var b;
			switch (d) {
				case Number:
					b = z.Number;
					break;
				case String:
					b = z.String;
					break;
				case Boolean:
					b = z.Boolean;
					break;
				case Function:
					b = z.Function;
					break;
				default:
					b = s;
			}
			return b === s ? this.Where(function (c) {
				return c instanceof d;
			}) : this.Where(function (a) {
				return typeof a === b;
			});
		},
		Zip: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var e, b, f = 0;
				return new w(function () {
					e = d.GetEnumerator();
					b = t.From(c).GetEnumerator();
				},
				function () {
					return e.MoveNext() && b.MoveNext() ? this.Yield(a(e.Current(), b.Current(), f++)) : r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Join: function (f, b, a, d, c) {
			b = u.CreateLambda(b);
			a = u.CreateLambda(a);
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			var e = this;
			return new t(function () {
				var g, j, h = s,
				i = 0;
				return new w(function () {
					g = e.GetEnumerator();
					j = t.From(f).ToLookup(a, x.Identity, c);
				},
				function () {
					while (v) {
						if (h != s) {
							var k = h[i++];
							if (k !== undefined) {
								return this.Yield(d(g.Current(), k));
							}
							k = s;
							i = 0;
						}
						if (g.MoveNext()) {
							var l = b(g.Current());
							h = j.Get(l).ToArray();
						} else {
							return r;
						}
					}
				},
				function () {
					u.Dispose(g);
				});
			});
		},
		GroupJoin: function (g, b, a, d, c) {
			b = u.CreateLambda(b);
			a = u.CreateLambda(a);
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			var f = this;
			return new t(function () {
				var e = f.GetEnumerator(),
				h = s;
				return new w(function () {
					e = f.GetEnumerator();
					h = t.From(g).ToLookup(a, x.Identity, c);
				},
				function () {
					if (e.MoveNext()) {
						var i = h.Get(b(e.Current()));
						return this.Yield(d(e.Current(), i));
					}
					return r;
				},
				function () {
					u.Dispose(e);
				});
			});
		},
		All: function (a) {
			a = u.CreateLambda(a);
			var d = v;
			this.ForEach(function (b) {
				if (!a(b)) {
					d = r;
					return r;
				}
			});
			return d;
		},
		Any: function (d) {
			d = u.CreateLambda(d);
			var a = this.GetEnumerator();
			try {
				if (arguments.length == 0) {
					return a.MoveNext();
				}
				while (a.MoveNext()) {
					if (d(a.Current())) {
						return v;
					}
				}
				return r;
			} finally {
				u.Dispose(a);
			}
		},
		Concat: function (a) {
			var b = this;
			return new t(function () {
				var d, c;
				return new w(function () {
					d = b.GetEnumerator();
				},
				function () {
					if (c == s) {
						if (d.MoveNext()) {
							return this.Yield(d.Current());
						}
						c = t.From(a).GetEnumerator();
					}
					return c.MoveNext() ? this.Yield(c.Current()) : r;
				},
				function () {
					try {
						u.Dispose(d);
					} finally {
						u.Dispose(c);
					}
				});
			});
		},
		Insert: function (d, a) {
			var c = this;
			return new t(function () {
				var e, b, g = 0,
				f = r;
				return new w(function () {
					e = c.GetEnumerator();
					b = t.From(a).GetEnumerator();
				},
				function () {
					if (g == d && b.MoveNext()) {
						f = v;
						return this.Yield(b.Current());
					}
					if (e.MoveNext()) {
						g++;
						return this.Yield(e.Current());
					}
					return !f && b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					try {
						u.Dispose(e);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		Alternate: function (b) {
			b = t.Return(b);
			return this.SelectMany(function (a) {
				return t.Return(a).Concat(b);
			}).TakeExceptLast();
		},
		Contains: function (e, a) {
			a = u.CreateLambda(a);
			var d = this.GetEnumerator();
			try {
				while (d.MoveNext()) {
					if (a(d.Current()) === e) {
						return v;
					}
				}
				return r;
			} finally {
				u.Dispose(d);
			}
		},
		DefaultIfEmpty: function (a) {
			var c = this;
			return new t(function () {
				var b, d = v;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					if (b.MoveNext()) {
						d = r;
						return this.Yield(b.Current());
					} else {
						if (d) {
							d = r;
							return this.Yield(a);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Distinct: function (b) {
			return this.Except(t.Empty(), b);
		},
		Except: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var b, e;
				return new w(function () {
					b = d.GetEnumerator();
					e = new E(a);
					t.From(c).ForEach(function (f) {
						e.Add(f);
					});
				},
				function () {
					while (b.MoveNext()) {
						var f = b.Current();
						if (!e.Contains(f)) {
							e.Add(f);
							return this.Yield(f);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Intersect: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var b, e, f;
				return new w(function () {
					b = d.GetEnumerator();
					e = new E(a);
					t.From(c).ForEach(function (g) {
						e.Add(g);
					});
					f = new E(a);
				},
				function () {
					while (b.MoveNext()) {
						var g = b.Current();
						if (!f.Contains(g) && e.Contains(g)) {
							f.Add(g);
							return this.Yield(g);
						}
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SequenceEqual: function (e, c) {
			c = u.CreateLambda(c);
			var d = this.GetEnumerator();
			try {
				var a = t.From(e).GetEnumerator();
				try {
					while (d.MoveNext()) {
						if (!a.MoveNext() || c(d.Current()) !== c(a.Current())) {
							return r;
						}
					}
					return a.MoveNext() ? r : v;
				} finally {
					u.Dispose(a);
				}
			} finally {
				u.Dispose(d);
			}
		},
		Union: function (c, a) {
			a = u.CreateLambda(a);
			var d = this;
			return new t(function () {
				var f, b, e;
				return new w(function () {
					f = d.GetEnumerator();
					e = new E(a);
				},
				function () {
					var g;
					if (b === undefined) {
						while (f.MoveNext()) {
							g = f.Current();
							if (!e.Contains(g)) {
								e.Add(g);
								return this.Yield(g);
							}
						}
						b = t.From(c).GetEnumerator();
					}
					while (b.MoveNext()) {
						g = b.Current();
						if (!e.Contains(g)) {
							e.Add(g);
							return this.Yield(g);
						}
					}
					return r;
				},
				function () {
					try {
						u.Dispose(f);
					} finally {
						u.Dispose(b);
					}
				});
			});
		},
		OrderBy: function (a) {
			return new A(this, a, r);
		},
		OrderByDescending: function (b) {
			return new A(this, b, v);
		},
		Reverse: function () {
			var a = this;
			return new t(function () {
				var b, e;
				return new w(function () {
					b = a.ToArray();
					e = b.length;
				},
				function () {
					return e > 0 ? this.Yield(b[--e]) : r;
				},
				x.Blank);
			});
		},
		Shuffle: function () {
			var a = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = a.ToArray();
				},
				function () {
					if (b.length > 0) {
						var c = Math.floor(Math.random() * b.length);
						return this.Yield(b.splice(c, 1)[0]);
					}
					return r;
				},
				x.Blank);
			});
		},
		GroupBy: function (d, c, a, b) {
			var f = this;
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			if (a != s) {
				a = u.CreateLambda(a);
			}
			b = u.CreateLambda(b);
			return new t(function () {
				var e;
				return new w(function () {
					e = f.ToLookup(d, c, b).ToEnumerable().GetEnumerator();
				},
				function () {
					while (e.MoveNext()) {
						return a == s ? this.Yield(e.Current()) : this.Yield(a(e.Current().Key(), e.Current()));
					}
					return r;
				},
				function () {
					u.Dispose(e);
				});
			});
		},
		PartitionBy: function (d, c, a, b) {
			var f = this;
			d = u.CreateLambda(d);
			c = u.CreateLambda(c);
			b = u.CreateLambda(b);
			var e;
			if (a == s) {
				e = r;
				a = function (h, g) {
					return new F(h, g);
				};
			} else {
				e = v;
				a = u.CreateLambda(a);
			}
			return new t(function () {
				var g, i, j, h = [];
				return new w(function () {
					g = f.GetEnumerator();
					if (g.MoveNext()) {
						i = d(g.Current());
						j = b(i);
						h.push(c(g.Current()));
					}
				},
				function () {
					var k;
					while ((k = g.MoveNext()) == v) {
						if (j === b(d(g.Current()))) {
							h.push(c(g.Current()));
						} else {
							break;
						}
					}
					if (h.length > 0) {
						var l = e ? a(i, t.From(h)) : a(i, h);
						if (k) {
							i = d(g.Current());
							j = b(i);
							h = [c(g.Current())];
						} else {
							h = [];
						}
						return this.Yield(l);
					}
					return r;
				},
				function () {
					u.Dispose(g);
				});
			});
		},
		BufferWithCount: function (c) {
			var a = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = a.GetEnumerator();
				},
				function () {
					var e = [],
					f = 0;
					while (b.MoveNext()) {
						e.push(b.Current());
						if (++f >= c) {
							return this.Yield(e);
						}
					}
					return e.length > 0 ? this.Yield(e) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Aggregate: function (f, e, d) {
			return this.Scan(f, e, d).Last();
		},
		Average: function (d) {
			d = u.CreateLambda(d);
			var f = 0,
			e = 0;
			this.ForEach(function (a) {
				f += d(a); ++e;
			});
			return f / e;
		},
		Count: function (b) {
			b = b == s ? x.True : u.CreateLambda(b);
			var d = 0;
			this.ForEach(function (c, a) {
				if (b(c, a)) {
					++d;
				}
			});
			return d;
		},
		Max: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(function (c, d) {
				return c > d ? c : d;
			});
		},
		Min: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(function (c, d) {
				return c < d ? c : d;
			});
		},
		MaxBy: function (b) {
			b = u.CreateLambda(b);
			return this.Aggregate(function (a, d) {
				return b(a) > b(d) ? a : d;
			});
		},
		MinBy: function (b) {
			b = u.CreateLambda(b);
			return this.Aggregate(function (a, d) {
				return b(a) < b(d) ? a : d;
			});
		},
		Sum: function (b) {
			if (b == s) {
				b = x.Identity;
			}
			return this.Select(b).Aggregate(0,
			function (c, d) {
				return c + d;
			});
		},
		ElementAt: function (f) {
			var e, a = r;
			this.ForEach(function (c, b) {
				if (b == f) {
					e = c;
					a = v;
					return r;
				}
			});
			if (!a) {
				throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
			}
			return e;
		},
		ElementAtOrDefault: function (h, g) {
			var e, a = r;
			this.ForEach(function (c, b) {
				if (b == h) {
					e = c;
					a = v;
					return r;
				}
			});
			return !a ? g : e;
		},
		First: function (a) {
			if (a != s) {
				return this.Where(a).First();
			}
			var e, b = r;
			this.ForEach(function (c) {
				e = c;
				b = v;
				return r;
			});
			if (!b) {
				throw new Error("First:No element satisfies the condition.");
			}
			return e;
		},
		FirstOrDefault: function (a, b) {
			if (b != s) {
				return this.Where(b).FirstOrDefault(a);
			}
			var h, e = r;
			this.ForEach(function (c) {
				h = c;
				e = v;
				return r;
			});
			return !e ? a : h;
		},
		Last: function (a) {
			if (a != s) {
				return this.Where(a).Last();
			}
			var e, b = r;
			this.ForEach(function (c) {
				b = v;
				e = c;
			});
			if (!b) {
				throw new Error("Last:No element satisfies the condition.");
			}
			return e;
		},
		LastOrDefault: function (a, b) {
			if (b != s) {
				return this.Where(b).LastOrDefault(a);
			}
			var h, e = r;
			this.ForEach(function (c) {
				e = v;
				h = c;
			});
			return !e ? a : h;
		},
		Single: function (b) {
			if (b != s) {
				return this.Where(b).Single();
			}
			var e, a = r;
			this.ForEach(function (c) {
				if (!a) {
					a = v;
					e = c;
				} else {
					throw new Error(D);
				}
			});
			if (!a) {
				throw new Error("Single:No element satisfies the condition.");
			}
			return e;
		},
		SingleOrDefault: function (b, e) {
			if (e != s) {
				return this.Where(e).SingleOrDefault(b);
			}
			var h, a = r;
			this.ForEach(function (c) {
				if (!a) {
					a = v;
					h = c;
				} else {
					throw new Error(D);
				}
			});
			return !a ? b : h;
		},
		Skip: function (c) {
			var a = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = a.GetEnumerator();
					while (d++ < c && b.MoveNext()) { }
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		SkipWhile: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, e = 0,
				d = r;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					while (!d) {
						if (b.MoveNext()) {
							if (!a(b.Current(), e++)) {
								d = v;
								return this.Yield(b.Current());
							}
							continue;
						} else {
							return r;
						}
					}
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Take: function (c) {
			var a = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = a.GetEnumerator();
				},
				function () {
					return d++ < c && b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		TakeWhile: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() && a(b.Current(), d++) ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		TakeExceptLast: function (a) {
			if (a == s) {
				a = 1;
			}
			var b = this;
			return new t(function () {
				if (a <= 0) {
					return b.GetEnumerator();
				}
				var d, e = [];
				return new w(function () {
					d = b.GetEnumerator();
				},
				function () {
					while (d.MoveNext()) {
						if (e.length == a) {
							e.push(d.Current());
							return this.Yield(e.shift());
						}
						e.push(d.Current());
					}
					return r;
				},
				function () {
					u.Dispose(d);
				});
			});
		},
		TakeFromLast: function (a) {
			if (a <= 0 || a == s) {
				return t.Empty();
			}
			var b = this;
			return new t(function () {
				var e, c, d = [];
				return new w(function () {
					e = b.GetEnumerator();
				},
				function () {
					while (e.MoveNext()) {
						d.length == a && d.shift();
						d.push(e.Current());
					}
					if (c == s) {
						c = t.From(d).GetEnumerator();
					}
					return c.MoveNext() ? this.Yield(c.Current()) : r;
				},
				function () {
					u.Dispose(c);
				});
			});
		},
		IndexOf: function (d) {
			var b = s;
			this.ForEach(function (c, a) {
				if (c === d) {
					b = a;
					return v;
				}
			});
			return b !== s ? b : -1;
		},
		LastIndexOf: function (d) {
			var c = -1;
			this.ForEach(function (b, a) {
				if (b === d) {
					c = a;
				}
			});
			return c;
		},
		ToArray: function () {
			var b = [];
			this.ForEach(function (a) {
				b.push(a);
			});
			return b;
		},
		ToLookup: function (g, f, d) {
			g = u.CreateLambda(g);
			f = u.CreateLambda(f);
			d = u.CreateLambda(d);
			var h = new E(d);
			this.ForEach(function (i) {
				var e = g(i),
				b = f(i),
				c = h.Get(e);
				if (c !== undefined) {
					c.push(b);
				} else {
					h.Add(e, [b]);
				}
			});
			return new H(h);
		},
		ToObject: function (e, d) {
			e = u.CreateLambda(e);
			d = u.CreateLambda(d);
			var f = {};
			this.ForEach(function (a) {
				f[e(a)] = d(a);
			});
			return f;
		},
		ToDictionary: function (g, f, d) {
			g = u.CreateLambda(g);
			f = u.CreateLambda(f);
			d = u.CreateLambda(d);
			var h = new E(d);
			this.ForEach(function (b) {
				h.Add(g(b), f(b));
			});
			return h;
		},
		ToJSON: function (c, d) {
			return JSON.stringify(this.ToArray(), c, d);
		},
		ToString: function (b, d) {
			if (b == s) {
				b = "";
			}
			if (d == s) {
				d = x.Identity;
			}
			return this.Select(d).ToArray().join(b);
		},
		Do: function (a) {
			var c = this;
			a = u.CreateLambda(a);
			return new t(function () {
				var b, d = 0;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					if (b.MoveNext()) {
						a(b.Current(), d++);
						return this.Yield(b.Current());
					}
					return r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		ForEach: function (d) {
			d = u.CreateLambda(d);
			var f = 0,
			a = this.GetEnumerator();
			try {
				while (a.MoveNext()) {
					if (d(a.Current(), f++) === r) {
						break;
					}
				}
			} finally {
				u.Dispose(a);
			}
		},
		Write: function (a, b) {
			if (a == s) {
				a = "";
			}
			b = u.CreateLambda(b);
			var d = v;
			this.ForEach(function (c) {
				if (d) {
					d = r;
				} else {
					document.write(a);
				}
				document.write(b(c));
			});
		},
		WriteLine: function (b) {
			b = u.CreateLambda(b);
			this.ForEach(function (a) {
				document.write(b(a));
				document.write("<br />");
			});
		},
		Force: function () {
			var b = this.GetEnumerator();
			try {
				while (b.MoveNext()) { }
			} finally {
				u.Dispose(b);
			}
		},
		Let: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = t.From(a(c)).GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Share: function () {
			var b = this,
			a;
			return new t(function () {
				return new w(function () {
					if (a == s) {
						a = b.GetEnumerator();
					}
				},
				function () {
					return a.MoveNext() ? this.Yield(a.Current()) : r;
				},
				x.Blank);
			});
		},
		MemoizeAll: function () {
			var c = this,
			b, a;
			return new t(function () {
				var d = -1;
				return new w(function () {
					if (a == s) {
						a = c.GetEnumerator();
						b = [];
					}
				},
				function () {
					d++;
					return b.length <= d ? a.MoveNext() ? this.Yield(b[d] = a.Current()) : r : this.Yield(b[d]);
				},
				x.Blank);
			});
		},
		Catch: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					try {
						return b.MoveNext() ? this.Yield(b.Current()) : r;
					} catch (e) {
						a(e);
						return r;
					}
				},
				function () {
					u.Dispose(b);
				});
			});
		},
		Finally: function (a) {
			a = u.CreateLambda(a);
			var c = this;
			return new t(function () {
				var b;
				return new w(function () {
					b = c.GetEnumerator();
				},
				function () {
					return b.MoveNext() ? this.Yield(b.Current()) : r;
				},
				function () {
					try {
						u.Dispose(b);
					} finally {
						a();
					}
				});
			});
		},
		Trace: function (d, b) {
			if (d == s) {
				d = "Trace";
			}
			b = u.CreateLambda(b);
			return this.Do(function (a) {
				console.log(d, ":", b(a));
			});
		}
	};
	var x = {
		Identity: function (b) {
			return b;
		},
		True: function () {
			return v;
		},
		Blank: function () { }
	},
	z = {
		Boolean: typeof v,
		Number: typeof 0,
		String: typeof "",
		Object: typeof {},
		Undefined: typeof undefined,
		Function: typeof
		function () { }
	},
	u = {
		CreateLambda: function (b) {
			if (b == s) {
				return x.Identity;
			}
			if (typeof b == z.String) {
				if (b == "") {
					return x.Identity;
				} else {
					if (b.indexOf("=>") == -1) {
						return new Function("$,$$,$$$,$$$$", "return " + b);
					} else {
						var d = b.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
						return new Function(d[1], "return " + d[2]);
					}
				}
			}
			return b;
		},
		IsIEnumerable: function (a) {
			if (typeof Enumerator != z.Undefined) {
				try {
					new Enumerator(a);
					return v;
				} catch (d) { }
			}
			return r;
		},
		Compare: function (c, d) {
			return c === d ? 0 : c > d ? 1 : -1;
		},
		Dispose: function (b) {
			b != s && b.Dispose();
		}
	},
	B = {
		Before: 0,
		Running: 1,
		After: 2
	},
	w = function (h, i, j) {
		var e = new G,
		a = B.Before;
		this.Current = e.Current;
		this.MoveNext = function () {
			try {
				switch (a) {
					case B.Before:
						a = B.Running;
						h();
					case B.Running:
						if (i.apply(e)) {
							return v;
						} else {
							this.Dispose();
							return r;
						}
					case B.After:
						return r;
				}
			} catch (b) {
				this.Dispose();
				throw b;
			}
		};
		this.Dispose = function () {
			if (a != B.Running) {
				return;
			}
			try {
				j();
			} finally {
				a = B.After;
			}
		};
	},
	G = function () {
		var b = s;
		this.Current = function () {
			return b;
		};
		this.Yield = function (a) {
			b = a;
			return v;
		};
	},
	A = function (j, g, h, i) {
		var d = this;
		d.source = j;
		d.keySelector = u.CreateLambda(g);
		d.descending = h;
		d.parent = i;
	};
	A.prototype = new t;
	A.prototype.CreateOrderedEnumerable = function (c, d) {
		return new A(this.source, c, d, this);
	};
	A.prototype.ThenBy = function (a) {
		return this.CreateOrderedEnumerable(a, r);
	};
	A.prototype.ThenByDescending = function (b) {
		return this.CreateOrderedEnumerable(b, v);
	};
	A.prototype.GetEnumerator = function () {
		var g = this,
		b, a, f = 0;
		return new w(function () {
			b = [];
			a = [];
			g.source.ForEach(function (e, d) {
				b.push(e);
				a.push(d);
			});
			var c = C.Create(g, s);
			c.GenerateKeys(b);
			a.sort(function (d, e) {
				return c.Compare(d, e);
			});
		},
		function () {
			return f < a.length ? this.Yield(b[a[f++]]) : r;
		},
		x.Blank);
	};
	var C = function (f, g, h) {
		var b = this;
		b.keySelector = f;
		b.descending = g;
		b.child = h;
		b.keys = s;
	};
	C.Create = function (b, f) {
		var e = new C(b.keySelector, b.descending, f);
		return b.parent != s ? C.Create(b.parent, e) : e;
	};
	C.prototype.GenerateKeys = function (i) {
		var b = this;
		for (var k = i.length,
		l = b.keySelector,
		j = new Array(k), h = 0; h < k; h++) {
			j[h] = l(i[h]);
		}
		b.keys = j;
		b.child != s && b.child.GenerateKeys(i);
	};
	C.prototype.Compare = function (g, h) {
		var b = this,
		d = u.Compare(b.keys[g], b.keys[h]);
		if (d == 0) {
			if (b.child != s) {
				return b.child.Compare(g, h);
			}
			d = u.Compare(g, h);
		}
		return b.descending ? -d : d;
	};
	var y = function (b) {
		this.source = b;
	};
	y.prototype = new t;
	y.prototype.Any = function (b) {
		return b == s ? this.source.length > 0 : t.prototype.Any.apply(this, arguments);
	};
	y.prototype.Count = function (b) {
		return b == s ? this.source.length : t.prototype.Count.apply(this, arguments);
	};
	y.prototype.ElementAt = function (b) {
		return 0 <= b && b < this.source.length ? this.source[b] : t.prototype.ElementAt.apply(this, arguments);
	};
	y.prototype.ElementAtOrDefault = function (c, d) {
		return 0 <= c && c < this.source.length ? this.source[c] : d;
	};
	y.prototype.First = function (b) {
		return b == s && this.source.length > 0 ? this.source[0] : t.prototype.First.apply(this, arguments);
	};
	y.prototype.FirstOrDefault = function (b, c) {
		return c != s ? t.prototype.FirstOrDefault.apply(this, arguments) : this.source.length > 0 ? this.source[0] : b;
	};
	y.prototype.Last = function (c) {
		var b = this;
		return c == s && b.source.length > 0 ? b.source[b.source.length - 1] : t.prototype.Last.apply(b, arguments);
	};
	y.prototype.LastOrDefault = function (c, f) {
		var b = this;
		return f != s ? t.prototype.LastOrDefault.apply(b, arguments) : b.source.length > 0 ? b.source[b.source.length - 1] : c;
	};
	y.prototype.Skip = function (c) {
		var a = this.source;
		return new t(function () {
			var b;
			return new w(function () {
				b = c < 0 ? 0 : c;
			},
			function () {
				return b < a.length ? this.Yield(a[b++]) : r;
			},
			x.Blank);
		});
	};
	y.prototype.TakeExceptLast = function (b) {
		if (b == s) {
			b = 1;
		}
		return this.Take(this.source.length - b);
	};
	y.prototype.TakeFromLast = function (b) {
		return this.Skip(this.source.length - b);
	};
	y.prototype.Reverse = function () {
		var a = this.source;
		return new t(function () {
			var b;
			return new w(function () {
				b = a.length;
			},
			function () {
				return b > 0 ? this.Yield(a[--b]) : r;
			},
			x.Blank);
		});
	};
	y.prototype.SequenceEqual = function (a, b) {
		return (a instanceof y || a instanceof Array) && b == s && t.From(a).Count() != this.Count() ? r : t.prototype.SequenceEqual.apply(this, arguments);
	};
	y.prototype.ToString = function (b, c) {
		if (c != s || !(this.source instanceof Array)) {
			return t.prototype.ToString.apply(this, arguments);
		}
		if (b == s) {
			b = "";
		}
		return this.source.join(b);
	};
	y.prototype.GetEnumerator = function () {
		var a = this.source,
		d = 0;
		return new w(x.Blank,
		function () {
			return d < a.length ? this.Yield(a[d++]) : r;
		},
		x.Blank);
	};
	var E = function () {
		var b = function (d, g) {
			return Object.prototype.hasOwnProperty.call(d, g);
		},
		a = function (d) {
			return d === s ? "null" : d === undefined ? "undefined" : typeof d.toString === z.Function ? d.toString() : Object.prototype.toString.call(d);
		},
		f = function (i, h) {
			var g = this;
			g.Key = i;
			g.Value = h;
			g.Prev = s;
			g.Next = s;
		},
		c = function () {
			this.First = s;
			this.Last = s;
		};
		c.prototype = {
			AddLast: function (g) {
				var d = this;
				if (d.Last != s) {
					d.Last.Next = g;
					g.Prev = d.Last;
					d.Last = g;
				} else {
					d.First = d.Last = g;
				}
			},
			Replace: function (g, d) {
				if (g.Prev != s) {
					g.Prev.Next = d;
					d.Prev = g.Prev;
				} else {
					this.First = d;
				}
				if (g.Next != s) {
					g.Next.Prev = d;
					d.Next = g.Next;
				} else {
					this.Last = d;
				}
			},
			Remove: function (d) {
				if (d.Prev != s) {
					d.Prev.Next = d.Next;
				} else {
					this.First = d.Next;
				}
				if (d.Next != s) {
					d.Next.Prev = d.Prev;
				} else {
					this.Last = d.Prev;
				}
			}
		};
		var e = function (g) {
			var d = this;
			d.count = 0;
			d.entryList = new c;
			d.buckets = {};
			d.compareSelector = g == s ? x.Identity : g;
		};
		e.prototype = {
			Add: function (o, p) {
				var d = this,
				n = d.compareSelector(o),
				m = a(n),
				k = new f(o, p);
				if (b(d.buckets, m)) {
					for (var h = d.buckets[m], l = 0; l < h.length; l++) {
						if (d.compareSelector(h[l].Key) === n) {
							d.entryList.Replace(h[l], k);
							h[l] = k;
							return;
						}
					}
					h.push(k);
				} else {
					d.buckets[m] = [k];
				}
				d.count++;
				d.entryList.AddLast(k);
			},
			Get: function (n) {
				var d = this,
				j = d.compareSelector(n),
				m = a(j);
				if (!b(d.buckets, m)) {
					return undefined;
				}
				for (var k = d.buckets[m], h = 0; h < k.length; h++) {
					var l = k[h];
					if (d.compareSelector(l.Key) === j) {
						return l.Value;
					}
				}
				return undefined;
			},
			Set: function (q, I) {
				var d = this,
				n = d.compareSelector(q),
				p = a(n);
				if (b(d.buckets, p)) {
					for (var l = d.buckets[p], h = 0; h < l.length; h++) {
						if (d.compareSelector(l[h].Key) === n) {
							var o = new f(q, I);
							d.entryList.Replace(l[h], o);
							l[h] = o;
							return v;
						}
					}
				}
				return r;
			},
			Contains: function (n) {
				var d = this,
				k = d.compareSelector(n),
				m = a(k);
				if (!b(d.buckets, m)) {
					return r;
				}
				for (var l = d.buckets[m], h = 0; h < l.length; h++) {
					if (d.compareSelector(l[h].Key) === k) {
						return v;
					}
				}
				return r;
			},
			Clear: function () {
				this.count = 0;
				this.buckets = {};
				this.entryList = new c;
			},
			Remove: function (l) {
				var d = this,
				k = d.compareSelector(l),
				j = a(k);
				if (!b(d.buckets, j)) {
					return;
				}
				for (var h = d.buckets[j], i = 0; i < h.length; i++) {
					if (d.compareSelector(h[i].Key) === k) {
						d.entryList.Remove(h[i]);
						h.splice(i, 1);
						if (h.length == 0) {
							delete d.buckets[j];
						}
						d.count--;
						return;
					}
				}
			},
			Count: function () {
				return this.count;
			},
			ToEnumerable: function () {
				var g = this;
				return new t(function () {
					var d;
					return new w(function () {
						d = g.entryList.First;
					},
					function () {
						if (d != s) {
							var h = {
								Key: d.Key,
								Value: d.Value
							};
							d = d.Next;
							return this.Yield(h);
						}
						return r;
					},
					x.Blank);
				});
			}
		};
		return e;
	}(),
	H = function (c) {
		var d = this;
		d.Count = function () {
			return c.Count();
		};
		d.Get = function (a) {
			return t.From(c.Get(a));
		};
		d.Contains = function (a) {
			return c.Contains(a);
		};
		d.ToEnumerable = function () {
			return c.ToEnumerable().Select(function (b) {
				return new F(b.Key, b.Value);
			});
		};
	},
	F = function (d, c) {
		this.Key = function () {
			return d;
		};
		y.call(this, c);
	};
	F.prototype = new y;
	return t;
}();
if (typeof define === "function" && define.cmd) {
	define(function (require, exports,module) {
		module.exports = Enumerable;
	});
>>>>>>> 6382325fea1fe1d8e6bef0179fd4fe255bd1d004
}