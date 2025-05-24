package com.Football.Tournament.config;

import com.Football.Tournament.security.CustomUserDetailsService;
import com.Football.Tournament.security.JwtAuthenticationEntryPoint;
import com.Football.Tournament.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors()
                .and()
            .csrf()
                .disable()
            .exceptionHandling()
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/v2/api-docs", "/configuration/**", "/swagger*/**", "/webjars/**").permitAll()
                .antMatchers(HttpMethod.GET, "/home/**").permitAll()
                // Admin-only endpoints
                .antMatchers(HttpMethod.POST, "/home/createTournament").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/home/updateTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deleteTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deleteAllTournaments").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/home/addTeamToTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/removeTeamFromTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deleteAllTeamsInTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deleteAllPlayersInTournament/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/home/createTeam").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/home/updateTeam/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deleteTeam/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/home/createPlayer").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/home/updatePlayer/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deletePlayer/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/home/deletePlayersByTeamId/**").hasRole("ADMIN")
                .anyRequest().authenticated();

        // Add our custom JWT security filter
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
