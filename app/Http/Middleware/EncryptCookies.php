<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;
use Illuminate\Http\Request;
use Closure;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     */
    protected $except = [
        'lest_session',
        'XSRF-TOKEN',
    ];
    
    /**
     * Determine if the cookie should be encrypted.
     */
    public function isDisabled($name)
    {
        // Don't encrypt session cookie or any cookie in the except list
        $sessionCookie = config('session.cookie', 'lest_session');
        if (in_array($name, $this->except) || 
            $name === $sessionCookie ||
            str_ends_with($name, '_session')) {
            return true;
        }
        // Call parent to check default exclusions
        return parent::isDisabled($name);
    }
    
    /**
     * Decrypt the cookies on the request.
     * Session cookies are never encrypted, so we skip them entirely.
     */
    protected function decrypt($request)
    {
        foreach ($request->cookies as $key => $cookie) {
            // Session cookies are never encrypted - skip them completely
            if ($this->isDisabled($key)) {
                continue;
            }

            try {
                $value = $this->decryptCookie($key, $cookie);
                $request->cookies->set($key, $this->validateValue($key, $value));
            } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
                $request->cookies->set($key, null);
            }
        }

        return $request;
    }
}
