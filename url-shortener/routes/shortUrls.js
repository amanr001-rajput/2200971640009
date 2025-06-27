const express = require('express');
const router = express.Router();
const store = require('../data/store');
const generateShortcode = require('../utils/generateShortcode');
const geoip = require('geoip-lite');
const dayjs = require('dayjs');
const log = require('../utils/logger');

const hostname = 'http://localhost:3000';


router.post('/shorturls', async (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || !/^https?:\/\/.+/.test(url)) {
        await log("backend", "error", "handler", "Invalid URL received");
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const code = shortcode || generateShortcode();

    if (store.urls[code]) {
        await log("backend", "warn", "handler", `Shortcode conflict: ${code}`);
        return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const createdAt = new Date();
    const expiry = new Date(createdAt.getTime() + validity * 60000);

    store.urls[code] = {
        originalUrl: url,
        createdAt,
        expiry,
        clicks: []
    };

    await log("backend", "info", "handler", `Short URL created for code: ${code}`);

    res.status(201).json({
        shortLink: `${hostname}/${code}`,
        expiry: expiry.toISOString()
    });
});


router.get('/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    const entry = store.urls[shortcode];

    if (!entry) {
        await log("backend", "error", "handler", `Shortcode not found: ${shortcode}`);
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    const now = new Date();
    if (now > entry.expiry) {
        await log("backend", "warn", "handler", `Expired link accessed: ${shortcode}`);
        return res.status(410).json({ error: 'Link expired' });
    }

    const geo = geoip.lookup(req.ip);
    const referrer = req.get('Referer') || 'Direct';

    entry.clicks.push({
        timestamp: new Date(),
        referrer,
        geo: geo ? `${geo.city || 'Unknown'}, ${geo.country || 'Unknown'}` : 'Unknown'
    });

    await log("backend", "info", "handler", `Redirected for shortcode: ${shortcode}`);

    res.redirect(entry.originalUrl);
});


router.get('/shorturls/:shortcode', async (req, res) => {
    const { shortcode } = req.params;
    const entry = store.urls[shortcode];

    if (!entry) {
        await log("backend", "error", "handler", `Stats requested for unknown shortcode: ${shortcode}`);
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    await log("backend", "debug", "handler", `Stats returned for shortcode: ${shortcode}`);

    res.json({
        originalUrl: entry.originalUrl,
        createdAt: entry.createdAt,
        expiry: entry.expiry,
        totalClicks: entry.clicks.length,
        clicks: entry.clicks
    });
});

module.exports = router;