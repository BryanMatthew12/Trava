<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRegisterRequest;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginRegisterController extends Controller
{
    /**
     * Instantiate a new LoginRegisterController instance.
     */
    public function __construct()
    {
        $this->middleware('guest')->except([
            'logout', 'home' // home diubah sesuain routingnya
        ]);
        $this->middleware('auth')->only('logout', 'home'); // home diubah sesuain routingnya
        $this->middleware('verified')->only('home'); // home diubah sesuain routingnya 
    }

    /**
     * Display a registration form.
     *
     * @return \Illuminate\Http\Response
     */
    public function register()
    {
        return view('auth.register'); 
    }

    /**
     * Store a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoginRegisterRequest $request) //REGISTER METHOD (perlu generate token atau ngga?)
    {
        // For API Testing
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        
        $token = JWTAuth::fromUser($user);
        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => $user,
        ], 201);

        // For real application
        // User::create([
        //     'username' => $request->username,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password)
        // ]);
        // return redirect()->route('dashboard')->withSuccess('You have successfully registered & logged in!');
    }

    /**
     * Display a login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function login()
    {
        return view('auth.login');
    }

    /**
     * Authenticate the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function authenticate(Request $request) // LOGIN METHOD (Generate JWT Token)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => Auth::user()
        ]);

        return back()->withErrors([
            'email' => 'Your provided credentials do not match in our records.',
        ])->onlyInput('email');

    } 
    
    public function refreshToken(Request $request)
    {
        try {
            $newToken = JWTAuth::parseToken()->refresh();
            return response()->json([
                'token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }

    /**
     * Display a dashboard to authenticated users.
     *
     * @return \Illuminate\Http\Response
     */
    public function dashboard()
    {
        if(Auth::check())
        {
            return view('auth.dashboard');
        }
        
        return redirect()->route('login')
            ->withErrors([
            'email' => 'Please login to access the dashboard.',
        ])->onlyInput('email');
    } 
    
    /**
     * Log out the user from application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

     public function logout(Request $request)
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
    

}