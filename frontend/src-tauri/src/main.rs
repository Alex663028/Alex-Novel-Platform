// Prevents an extra console window from being spawned in release mode
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    alex_desktop_lib::run()
}
