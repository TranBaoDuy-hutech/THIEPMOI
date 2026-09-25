(function () {
  const CONFIG = {
    supabaseUrl: 'https://yxeatkqsikzitxqqdfvc.supabase.co',
    supabaseAnonKey: 'sb_publishable_PrBvWZ44-iPDPAp9yu0n2A_JrQSX4to',
    tableName: 'guests'
  };

  const GuestDB = {
    client: null,

    init() {
      if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey || CONFIG.supabaseUrl.includes('PASTE_') || CONFIG.supabaseAnonKey.includes('PASTE_')) {
        return false;
      }

      try {
        this.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
        return true;
      } catch (error) {
        console.warn('Supabase init failed:', error);
        return false;
      }
    },

    isConfigured() {
      return !!this.client;
    },

    async saveGuest(name, wish = '') {
      if (!this.client) return { ok: false, error: 'Supabase chưa được cấu hình.' };

      const trimmed = String(name || '').trim();
      const cleanWish = String(wish || '').trim();
      if (!trimmed) return { ok: false, error: 'Tên khách đang trống.' };
      if (cleanWish.length > 500) return { ok: false, error: 'Lời chúc tối đa 500 ký tự.' };

      const { error } = await this.client.from(CONFIG.tableName).insert([
        { name: trimmed, wish: cleanWish || null, status: 'confirmed' }
      ]);

      if (error) {
        console.warn('Supabase insert failed:', error);
        return { ok: false, error: error.message };
      }

      return { ok: true };
    },

    async getGuests() {
      if (!this.client) return [];

      const { data, error } = await this.client
        .from(CONFIG.tableName)
        .select('*')
        .not('wish', 'is', null)
        .neq('wish', '')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase select failed:', error);
        return [];
      }

      return data || [];
    }
  };

  window.GuestDB = GuestDB;
  GuestDB.init();
})();
