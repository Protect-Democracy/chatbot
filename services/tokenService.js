const axios = require('axios');
const jwt = require('jsonwebtoken');

class TokenService {
    constructor() {
        this.initialized = false;
        this.refreshToken = null;
        this.accessToken = null;
        this.accessTokenExpiry = null;
    }

    validateConfig() {
        const required = ['API_BASE', 'AGENT_ID', 'AGENT_KEY'];
        for (const key of required) {
            if (!process.env[key]) {
                throw new Error(`${key} is required`);
            }
        }

        // Validate AGENT_ID format (UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(process.env.AGENT_ID)) {
            throw new Error('AGENT_ID format is invalid');
        }
    }

    initialize() {
        if (this.initialized) return;
        
        this.validateConfig();

        this.API_BASE = process.env.API_BASE;
        this.AGENT_ID = process.env.AGENT_ID;
        this.AGENT_KEY = process.env.AGENT_KEY;
        console.log('[TokenService] Initialized with:', {
            API_BASE: this.API_BASE,
            AGENT_ID: this.AGENT_ID,
            AGENT_KEY: this.AGENT_KEY ? '***' : undefined
        });
        this.initialized = true;
    }

    isExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded?.exp) return true;
            
            const expiryTime = decoded.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            
            console.log('[TokenService] Checking token expiry:', {
                exp: new Date(expiryTime).toISOString(),
                now: new Date(now).toISOString(),
                isExpired: now >= expiryTime
            });
            
            return now >= expiryTime;
        } catch (error) {
            console.error('[TokenService] Error checking token:', error.message);
            return true;
        }
    }

    async getRefreshToken() {
        console.log('[TokenService] Getting new refresh token...');
        try {
            const url = `${this.API_BASE}/auth/agents/${this.AGENT_ID}/token`;
            const response = await axios.post(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': this.AGENT_KEY
                }
            });

            if (!response.data?.refresh_token) {
                throw new Error('No refresh token in response');
            }

            console.log('[TokenService] Got new refresh token');
            return response.data.refresh_token;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            throw new Error(`Failed to get refresh token: ${errorMessage}`);
        }
    }

    async getAccessToken(refreshToken) {
        console.log('[TokenService] Getting new access token...');
        try {
            const url = `${this.API_BASE}/auth/agents/${this.AGENT_ID}/token?refresh_token=${refreshToken}`;
            const response = await axios.put(url, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': this.AGENT_KEY
                }
            });

            if (!response.data?.access_token) {
                throw new Error('No access token in response');
            }

            console.log('[TokenService] Got new access token');
            return response.data.access_token;
        } catch (error) {
            if (error.response?.status === 401) {
                throw 'Invalid refresh token';
            }
            const errorMessage = error.response?.data?.error || error.message;
            throw new Error(`Failed to get access token: ${errorMessage}`);
        }
    }

    async ensureValidToken() {
        console.log('[TokenService] Ensuring valid token...');
        
        try {
            // If we have a valid access token, use it
            if (this.accessToken && this.accessTokenExpiry && this.accessTokenExpiry > Date.now()) {
                console.log('[TokenService] Using existing valid access token');
                return this.accessToken;
            }

            // Get new refresh token if we don't have one
            if (!this.refreshToken) {
                console.log('[TokenService] Getting new refresh token');
                this.refreshToken = await this.getRefreshToken();
            }

            // Get new access token using refresh token
            console.log('[TokenService] Getting access token using refresh token');
            this.accessToken = await this.getAccessToken(this.refreshToken);
            
            // Set expiry time from JWT
            const decoded = jwt.decode(this.accessToken);
            if (!decoded?.exp) {
                throw new Error('Invalid access token: missing expiry');
            }
            this.accessTokenExpiry = decoded.exp * 1000;
            
            return this.accessToken;
        } catch (error) {
            this.refreshToken = null;
            this.accessToken = null;
            this.accessTokenExpiry = null;
            throw error;
        }
    }
}

module.exports = new TokenService();