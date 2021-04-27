<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $game = new Game();
        $game->name = "Kingdom Hearts III";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912200/angular_prueba/1547631928_341081_1547632543_noticia_normal_wwcngf.jpg";
        $game->save();
        $game = new Game();
        $game->name = "Kingdom Hearts II";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912137/angular_prueba/Portadas-KH-2_jap0lx.png";
        $game->save();
        $game = new Game();
        $game->name = "Dark Souls III";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912319/angular_prueba/Dark-Souls-3-Wallpaper-1280x720_rmi9dp.jpg";
        $game->save();
        $game = new Game();
        $game->name = "Dark Souls Remastered";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912399/angular_prueba/unnamed_xu2ubr.jpg";
        $game->save();
        $game = new Game();
        $game->name = "No Man's Skye";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912454/angular_prueba/1366_2000_aeqxds.jpg";
        $game->save();$game = new Game();
        $game->name = "Shipped";
        $game->url_image = "https://res.cloudinary.com/luislopez2129/image/upload/v1618912558/angular_prueba/shippedportada_e2kfkr.jpg";
        $game->save();

    }
}
