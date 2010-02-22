#!/usr/bin/perl -w

use HTTP::Request::Common;
use LWP::UserAgent;
use JSON;
use Getopt::Long;


$HTTP_SERVER         = 'http://192.168.1.6/ldc';
$RPC_PATH            = '/server/';

my $verbose;
my $operations;
my $categories;
my $comptes;
my $all;
GetOptions(
        "verbose"    => \$verbose,
        "operations" => \$operations,
        "categories" => \$categories,
        "comptes"    => \$comptes,
        "all"        => \$all
);

###############################################################################
# FUNCTIONS
###############################################################################

sub send_json
{
    print ("*******************************************") if $verbose;
    my ($filename, $json) = @_;
    print "\n[$filename]\n ==> $json\n" if $verbose;
    my $ua = LWP::UserAgent->new;
    $ret = $ua->request(POST "$HTTP_SERVER"."$RPC_PATH"."$filename", [json   => $json ]);
    if ($ret->is_success) {
        print "<== ".$ret->content."\n" if $verbose;
	return $ret->content;
    }
    print STDERR $ret->status_line, "\n";
}


sub read_json
{
    my ($filename) = @_;
    open(my $fh, '<', $filename) or die ($!);
    local $/ = undef;
    my $json = <$fh>;
    close($fh);
    return $json;
}

sub test_result
{
    my ($test_name, $r) = @_;

    if (!($r =~ /\{/) && $r != 0) {
        print STDERR "$test_name FAILED $r\n";
        exit 1;
    } else {
        print "$test_name is OK\n";
    }
}

my $json;
my $json_rcv;
my $tmp;
my $json_id;
my $id;
###############################################################################
# OPERAIONS
###############################################################################
if($operations || $all) {

    # add
    $json = read_json('add_operation.json');
    $json_rcv = send_json 'add_operation.php', $json;
    test_result 'add_operation', $json_rcv;
    $tmp = from_json $json_rcv;
    $json_id =  $json_rcv;
    $id = $tmp->{'id'};

    # update
    $json = read_json('update_operation.json');
    $json =~ s/ID/$id/;
    $json_rcv = send_json 'update_operation.php', $json;
    test_result 'update_operation', $json_rcv;

    # get
    $json = read_json('get_operation.json');
    $json_rcv = send_json 'get_operation.php', $json;
    test_result 'get_operation', $json_rcv;

    # del
    $json_rcv = send_json 'del_operation.php', $json_id;
    test_result 'del_operation', $json_rcv;
}



###############################################################################
# CATEGORIES
###############################################################################
if ($categories || $all) {
    # add
    $json = read_json('add_categorie.json');
    $json_rcv = send_json 'add_categorie.php', $json;
    test_result 'add_categorie', $json_rcv;
    $tmp = from_json $json_rcv;
    $json_id =  $json_rcv;
    $id = $tmp->{'id'};

    # update
    $json = read_json('update_categorie.json');
    $json =~ s/ID/$id/;
    $json_rcv = send_json 'update_categorie.php', $json;
    test_result 'update_categorie', $json_rcv;

    # get
    $json_rcv = send_json 'get_categories.php', '{}';
    test_result 'get_categories', $json_rcv;

    # del
    $json_rcv = send_json 'del_categorie.php', $json_id;
    test_result 'del_categorie', $json_rcv;
}

###############################################################################
# COMPTES
###############################################################################
if ($comptes || $all) {

    # add
    $json = read_json('add_compte.json');
    $json_rcv = send_json 'add_compte.php', $json;
    test_result 'add_compte', $json_rcv;
    $tmp = from_json $json_rcv;
    $json_id =  $json_rcv;
    $id = $tmp->{'id'};

    # update
    $json = read_json('update_compte.json');
    $json =~ s/ID/$id/;
    $json_rcv = send_json 'update_compte.php', $json;
    test_result 'update_compte', $json_rcv;

    # get
    $json_rcv = send_json 'get_comptes.php', '{}';
    test_result 'get_comptes', $json_rcv;

    # del
    $json_rcv = send_json 'del_compte.php', $json_id;
}

exit 0;



