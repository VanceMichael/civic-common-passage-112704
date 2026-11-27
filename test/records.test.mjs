import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const data = JSON.parse(await readFile(new URL('../data/records.json', import.meta.url), 'utf8'));

test("共享楼梯段、无障碍侧路和巡查地点更正", () => {
  for (const [collection, rows] of Object.entries(data)) {
    const ids = rows.map((row) => row.id);
    assert.ok(ids.every((id) => typeof id === 'string' && id.length > 0), collection);
    assert.equal(new Set(ids).size, ids.length, collection);
  }
  for (const [collection, field, related] of [
  [
    "inspections",
    "segment",
    "segments"
  ],
  [
    "moves",
    "sector",
    "sectors"
  ],
  [
    "moves",
    "route",
    "segments"
  ]
]) {
    const ids = new Set(data[related].map((row) => row.id));
    for (const row of data[collection]) {
      for (const id of [row[field]].flat()) {
        assert.ok(ids.has(id), collection + '/' + row.id + '/' + field);
      }
    }
  }
  for (const [collection, id, field, expected] of [
  [
    "segments",
    "ao",
    "crews",
    1
  ],
  [
    "segments",
    "es",
    "access",
    [
      "stepfree"
    ]
  ],
  [
    "inspections",
    "paper-12-v2",
    "segment",
    "ao"
  ]
]) {
    assert.deepEqual(data[collection].find((row) => row.id === id)?.[field], expected);
  }
});
