<?php

namespace WPSP;


class Admin
{
    public function __construct()
    {
        $this->load_plugin_menu_pages();
        $this->pro_enabled();
        // Core
        add_filter('plugin_action_links_' . WPSP_PLUGIN_BASENAME, array($this, 'insert_plugin_links'));
        add_filter('plugin_row_meta', array($this, 'insert_plugin_row_meta'), 10, 2);
        $this->admin_notice();
        $this->usage_tracker();
        $this->load_dashboard_widgets();
        $this->load_settings();

	    add_action( 'elementor/editor/footer', [ $this, 'schedulepress_el_tab' ], 100 );
	    add_action( 'wp_ajax_wpsp_el_editor_form', [ $this, 'wpsp_el_tab_action' ] );
    }
    public function load_plugin_menu_pages()
    {
        new Admin\Menu();
    }
    public function load_dashboard_widgets()
    {
        new Admin\Widgets\ScheduledPostList();
    }

    /**
     * Check Pro version is enabled
     */
    public function pro_enabled()
    {
        if (function_exists('is_plugin_active')) {
            return $this->pro_enabled = is_plugin_active('wp-scheduled-posts-pro/wp-scheduled-posts-pro.php');
        } else {
            if (class_exists('WpScp_Pro')) {
                return $this->pro_enabled = true;
            }
        }
    }

    /**
     * Extending plugin links
     *
     * @since 2.3.1
     */
    public function insert_plugin_links($links)
    {
        // settings
        $links[] = sprintf('<a href="admin.php?page=' . WPSP_SETTINGS_SLUG . '">' . __('Settings', 'wp-scheduled-posts') . '</a>');

        // go pro
        if (!$this->pro_enabled()) {
            $links[] = sprintf('<a href="https://wpdeveloper.net/in/schedulepress-pro" target="_blank" style="color: #39b54a; font-weight: bold;">' . __('Go Pro', 'wp-scheduled-posts') . '</a>');
        }

        return $links;
    }

    /**
     * Extending plugin row meta
     *
     * @since 2.3.1
     */
    public function insert_plugin_row_meta($links, $file)
    {
        if (WPSP_PLUGIN_BASENAME == $file) {
            // docs & faq
            $links[] = sprintf('<a href="https://wpdeveloper.net/docs/schedulepress" target="_blank">' . __('Docs & FAQs', 'wp-scheduled-posts') . '</a>');

            // video tutorials
            // $links[] = sprintf('<a href="https://www.youtube.com/channel/UCOjzLEdsnpnFVkm1JKFurPA?utm_medium=admin&utm_source=wp.org&utm_term=ea" target="_blank">' . __('Video Tutorials') . '</a>');
        }

        return $links;
    }

    public function admin_notice()
    {
        $notice = new Admin\WPDev\WPDevNotice(WPSP_PLUGIN_BASENAME, WPSP_VERSION);

        /**
         * Current Notice End Time.
         * Notice will dismiss in 3 days if user does nothing.
         */
        $notice->cne_time = '3 Day';
        /**
         * Current Notice Maybe Later Time.
         * Notice will show again in 7 days
         */
        $notice->maybe_later_time = '7 Day';

        $notice->text_domain = 'wp-scheduled-posts';

        $scheme = (parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY)) ? '&' : '?';
        $url = $_SERVER['REQUEST_URI'] . $scheme;
        $notice->links = [
            'review' => array(
                'later' => array(
                    'link' => 'https://wpdeveloper.net/go/review-wpsp',
                    'target' => '_blank',
                    'label' => __('Ok, you deserve it!', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-external',
                ),
                'allready' => array(
                    'link' => $url,
                    'label' => __('I already did', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-smiley',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
                'maybe_later' => array(
                    'link' => $url,
                    'label' => __('Maybe Later', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-calendar-alt',
                    'data_args' => [
                        'later' => true,
                    ],
                ),
                'support' => array(
                    'link' => 'https://wpdeveloper.net/support',
                    'label' => __('I need help', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-sos',
                ),
                'never_show_again' => array(
                    'link' => $url,
                    'label' => __('Never show again', 'wp-scheduled-posts'),
                    'icon_class' => 'dashicons dashicons-dismiss',
                    'data_args' => [
                        'dismiss' => true,
                    ],
                ),
            ),
        ];

        /**
         * This is review message and thumbnail.
         */
        $notice->message('review', '<p>' . __('We hope you\'re enjoying SchedulePress! Could you please do us a BIG favor and give it a 5-star rating on WordPress to help us spread the word and boost our motivation?', 'wp-scheduled-posts') . '</p>');
        $notice->thumbnail('review', plugins_url('assets/images/wpsp-logo.svg', WPSP_PLUGIN_BASENAME));
        /**
         * This is upsale notice settings
         * classes for wrapper, 
         * Message message for showing.
         */
        $notice->classes('upsale', 'notice is-dismissible ');
        $notice->message('upsale', '<p>' . __('Enjoying <strong>SchedulePress</strong>? Why not check our <strong><a href="https://wpdeveloper.net/in/wp-scheduled-posts-pro" target="_blank">Pro version</a></strong> which will enable auto schedule, multi social account share and many more features! [<strong><a href="https://wpdeveloper.net/plugins/wp-scheduled-posts/" target="_blank">Learn More</a></strong>]', 'wp-scheduled-posts') . '</p>');
        $notice->thumbnail('upsale', plugins_url('assets/images/wpsp-logo.svg', WPSP_PLUGIN_BASENAME));

        $notice->upsale_args = array(
            'slug'      => 'wp-scheduled-posts-pro',
            'page_slug' => 'wp-scheduled-posts-pro',
            'file'      => 'wp-scheduled-posts-pro.php',
            'btn_text'  => __('Install Pro', 'wp-scheduled-posts'),
            'condition' => [
                'by' => 'class',
                'class' => 'WpScp_Pro'
            ],
        );
        $notice->options_args = array(
            'notice_will_show' => [
                'opt_in' => $notice->timestamp,
                'upsale' => $notice->makeTime($notice->timestamp, '7 Day'),
                'review' => $notice->makeTime($notice->timestamp, '3 Day'), // after 3 days
            ],
        );
        // main notice init
        $notice->init();
    }
    public function usage_tracker()
    {
        new Admin\WPDev\PluginUsageTracker(
            WPSP_PLUGIN_FILE,
            'http://app.wpdeveloper.net',
            array(),
            true,
            true,
            1
        );
    }

    public function load_settings()
    {
        new Admin\Settings(WPSP_SETTINGS_SLUG, WPSP_SETTINGS_NAME);
    }

    public function schedulepress_el_tab () { ?>
        <style>
            #schedulepress-elementor-modal.elementor-templates-modal .dialog-message {
                max-height: 50vh;
            }

            @media (max-width: 1439px) {
                #schedulepress-elementor-modal.elementor-templates-modal .dialog-widget-content {
                    max-width: 500px;
                }
            }

            @media (min-width: 1440px) {
                #schedulepress-elementor-modal.elementor-templates-modal .dialog-widget-content {
                    max-width: 500px;
                }
            }

            #schedulepress-elementor-modal form label {
                display: flex;
                align-items: center;
                text-align: left;
            }

            #schedulepress-elementor-modal form label input {
                background: #fff;
            }

            #schedulepress-elementor-modal form label + label {
                margin-top: 15px;
                cursor: no-drop;
                opacity: .5;
            }

            #schedulepress-elementor-modal form label + label input {
                cursor: no-drop;
            }

            #schedulepress-elementor-modal form label > span {
                white-space: nowrap;
                width: 120px;
                font-weight: 700;
            }

            .wpsp-el-form-submit.elementor-button-state > .elementor-state-icon + span {
                display: none;
            }
        </style>
	    <div class="dialog-widget dialog-lightbox-widget dialog-type-buttons dialog-type-lightbox elementor-templates-modal"
		    id="schedulepress-elementor-modal" style="display: none;">
		    <div class="dialog-widget-content dialog-lightbox-widget-content" style="top: 50%;left: 50%;transform: translate(-50%, -50%);">
			    <div class="dialog-header dialog-lightbox-header">
				    <div class="elementor-templates-modal__header">
					    <div class="elementor-templates-modal__header__logo-area">
						    <div class="elementor-templates-modal__header__logo">
								<span class="elementor-templates-modal__header__logo__icon-wrapper e-logo-wrapper">
									<i class="eicon-elementor"></i>
								</span>
							    <span class="elementor-templates-modal__header__logo__title"><?php esc_html_e( 'SchedulePress', 'wp-scheduled-posts' ); ?></span>
						    </div>
					    </div>
					    <div class="elementor-templates-modal__header__menu-area"></div>
					    <div class="elementor-templates-modal__header__items-area">
						    <div class="elementor-templates-modal__header__close elementor-templates-modal__header__close--normal elementor-templates-modal__header__item">
							    <i class="eicon-close" aria-hidden="true" title="Close"></i>
							    <span class="elementor-screen-only"><?php esc_html_e( 'Close', 'wp-scheduled-posts' ); ?></span>
						    </div>
						    <div id="elementor-template-library-header-tools"></div>
					    </div>
				    </div>
			    </div>
			    <div class="dialog-message dialog-lightbox-message">
				    <div class="dialog-content dialog-lightbox-content">
                        <form action="<?php echo admin_url( 'admin-ajax.php' ); ?>" method="post">
						    <?php
						    wp_nonce_field( 'wpsp-el-editor', 'wpsp-el-editor' );
						    $post_id = get_the_ID();
						    $post    = get_post( $post_id );
						    ?>
                            <input type="hidden" name="action" value="wpsp_el_editor_form">
                            <input type="hidden" name="id" value="<?php echo $post_id; ?>">

                            <label>
                                <span><?php esc_html_e( 'Publish On', 'wp-scheduled-posts' ); ?></span>
                                <input id="wpsp-schedule-datetime" type="text" name="date" value="<?php echo esc_attr( $post->post_date ) ?>" readonly>
                            </label>
                            <label title="<?php esc_html_e( 'Pro Feature', 'wp-scheduled-posts' ); ?>">
                                <span><?php esc_html_e( 'Republish On', 'wp-scheduled-posts' ); ?></span>
                                <input type="text" disabled>
                            </label>
                            <label title="<?php esc_html_e( 'Pro Feature', 'wp-scheduled-posts' ); ?>">
                                <span><?php esc_html_e( 'Unpublish On', 'wp-scheduled-posts' ); ?></span>
                                <input type="text" disabled>
                            </label>
                        </form>
                        <div class="wpsp-el-result"></div>
                    </div>
				    <div class="dialog-loading dialog-lightbox-loading"></div>
			    </div>
                <div class="dialog-buttons-wrapper dialog-lightbox-buttons-wrapper" style="display: flex;">
                    <button class="elementor-button elementor-button-success dialog-button wpsp-el-form-submit">
                        <span class="elementor-state-icon">
                            <i class="eicon-loading eicon-animation-spin" aria-hidden="true"></i>
                        </span>
                        <span><?php esc_html_e( 'Apply', 'wp-scheduled-posts' ); ?></span>
                    </button>
                </div>
		    </div>
	    </div>
        <div id="elementor-panel-footer-sub-menu-item-wpsp" class="elementor-panel-footer-sub-menu-item">
            <i class="elementor-icon eicon-folder" aria-hidden="true"></i>
            <span class="elementor-title"><?php esc_html_e( 'WPSP', 'wp-scheduled-posts' ); ?></span>
        </div>
        <div id="elementor-panel-footer-wpsp-modal" class="elementor-panel-footer-tool tooltip-target" data-tooltip="<?php esc_attr_e( 'SchedulePress', 'wp-scheduled-posts' ); ?>">
            <span id="elementor-panel-footer-wpsp-modal-label">
                <i class="eicon-preview-medium" aria-hidden="true"></i>
                <span class="elementor-screen-only"><?php echo __( 'SchedulePress', 'wp-scheduled-posts' ); ?></span>
            </span>
        </div>
<?php
    }

	public function wpsp_el_tab_action() {
		if ( check_ajax_referer( 'wpsp-el-editor', 'wpsp-el-editor' ) ) {
			$args = wp_parse_args( $_POST, [
				'id'          => 0,
				'date'        => '',
				'post_status' => 'future'
			] );

			$updated = wp_update_post( [
				'ID'            => absint( $args['id'] ),
				'post_date'     => $args['date'],
				'post_date_gmt' => $args['date'],
				'post_status'   => $args['post_status']
			] );

			wp_send_json_success( $updated );
		}
	}
}
